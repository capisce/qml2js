-- Copyright (c) 2012 Samuel Rødal
--
-- Permission is hereby granted, free of charge, to any person obtaining a
-- copy of this software and associated documentation files (the "Software"),
-- to deal in the Software without restriction, including without limitation
-- the rights to use, copy, modify, merge, publish, distribute, sublicense,
-- and/or sell copies of the Software, and to permit persons to whom the
-- Software is furnished to do so, subject to the following conditions:
--
-- The above copyright notice and this permission notice shall be included in
-- all copies or substantial portions of the Software.
--
-- THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
-- IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
-- FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
-- AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
-- LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
-- FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
-- DEALINGS IN THE SOFTWARE.

import Text.ParserCombinators.Parsec hiding (spaces)
import System.Environment
import Data.Char
import Data.List
import Data.List.Split (splitOn)
import Data.Maybe
import Data.Text (pack, unpack, strip)

spaceCharacter = char ' '

spaces :: Parser ()
spaces = skipMany1 spaceCharacter

data QmlParseObjectAnnotation = QmlParseOnAnnotation String

data QmlParseValue = QmlParseObject String (Maybe QmlParseObjectAnnotation) [QmlParseValue]
                     | QmlParseBinding String String
                     | QmlParsePropertyDeclaration String (Maybe String)

stripSurroundingSpaces = unpack . strip . pack

parseIdentifier :: Parser String
parseIdentifier = do
    first <- letter
    rest <- many (letter <|> digit)
    return $ first : rest

parseUpperCaseIdentifier :: Parser String
parseUpperCaseIdentifier = do
    first <- upper
    rest <- many (letter <|> digit)
    return $ first : rest

parseExpression :: Parser String
parseExpression = do
    str <- many (noneOf ";\n}")
    return (stripSurroundingSpaces str)

parseBlockInner :: Parser String
parseBlockInner = do
    a <- many1 (noneOf "{}")
    b <- option "" parseBlock
    return $ concat [a, b]

parseBlock :: Parser String
parseBlock = do
    a <- string "{"
    b <- many (parseBlockInner <|> parseBlock)
    c <- string "}"
    return $ a ++ concat b ++ c

parseCode :: Parser String
parseCode = parseBlock <|> parseExpression

parseCodeBinding :: Parser String
parseCodeBinding = do
    skipMany spaceCharacter
    char ':'
    skipMany spaceCharacter
    parseCode

parsePropertyDeclaration :: Parser QmlParseValue
parsePropertyDeclaration = do
    string "property"
    spaces
    string "var"
    spaces
    identifier <- parseIdentifier
    code <- optionMaybe parseCodeBinding
    return $ QmlParsePropertyDeclaration identifier code

parseBinding :: Parser QmlParseValue
parseBinding = do
    identifier <- parseIdentifier
    code <- parseCodeBinding
    return $ QmlParseBinding identifier code

blockSeparation = try (many1 ((skipMany spaceCharacter) >> (char ';' <|> char '\n') >> (skipMany spaceCharacter)))

parseOnBinding :: Parser QmlParseObjectAnnotation
parseOnBinding = do
    string "on"
    spaces
    x <- parseIdentifier
    return $ QmlParseOnAnnotation x

parseObject :: Parser QmlParseValue
parseObject = do
    identifier <- parseUpperCaseIdentifier
    skipMany spaceCharacter
    onBinding <- optionMaybe parseOnBinding
    skipMany spaceCharacter
    char '{' <?> "'{' at the beginning of \"" ++ identifier ++ "\" block"
    skipMany space
    block <- try (sepBy parseQmlValue blockSeparation) <|> endBy parseQmlValue blockSeparation
    skipMany space
    char '}' <?> "'}' at the end of \"" ++ identifier ++ "\" block"
    return $ QmlParseObject identifier onBinding block

parseQmlValue :: Parser QmlParseValue
parseQmlValue = parseObject
    <|> try parsePropertyDeclaration
    <|> parseBinding

instance Show QmlParseValue where
    show val = case val of
        QmlParsePropertyDeclaration identifier maybeCode -> "property " ++ identifier ++ (maybe "" (\x -> " with code \"" ++ x ++ "\"") maybeCode)
        QmlParseBinding identifier code -> "binding " ++ identifier ++ " to code \"" ++ code ++ "\""
        QmlParseObject identifier _ block -> "object " ++ identifier ++ " [ " ++ (concat (intersperse ", " (map show block))) ++ " ]"

parseExpr :: (Parser a) -> String -> String -> (a -> b) -> b
parseExpr parser identifier input process = case parse parser identifier input of
    Left err -> error ("Parse error: " ++ show err)
    Right val -> process val

check str = putStrLn str >> putStrLn (parseExpr parseQmlValue "qml" str show)
checkWithParser parser str = putStrLn (parseExpr parser "unknown" str show)

data QmlObject =
    QmlObject {
        objectType :: String,
        objectId :: String,
        childObjects :: [ QmlObject ],
        ownProperties :: [ String ],
        propertyBindings :: [ (String, String) ]
    }

getBinding :: QmlParseValue -> Maybe (String, String)
getBinding (QmlParseBinding key value) = Just (key, value)
getBinding (QmlParsePropertyDeclaration key (Just value)) = Just (key, value)
getBinding _ = Nothing

getOwnProperty :: QmlParseValue -> Maybe String
getOwnProperty (QmlParsePropertyDeclaration key _) = Just key
getOwnProperty _ = Nothing

getOnBinding :: String -> QmlParseObjectAnnotation -> [ (String, String) ]
getOnBinding parentId (QmlParseOnAnnotation property) = [ ("target", parentId), ("property", show property) ]

getObject :: String -> String -> QmlParseValue -> QmlObject
getObject parentId baseId (QmlParseObject qmlType onBinding children) =
    let bindings = maybe [] (getOnBinding parentId) onBinding ++ mapMaybe getBinding children 
        maybeId = find (\(key, _) -> key == "id") bindings
        childObjects = filter (\x -> case x of (QmlParseObject _ _ _) -> True ; _ -> False) children
        numChildObjects = length childObjects
        id = case maybeId of
                Nothing -> baseId
                Just (_, value) -> value
        childIds = map (\x -> baseId ++ "_" ++ show x) [1..]
    in QmlObject {
           objectType = qmlType,
           objectId = id,
           childObjects = zipWith (getObject id) childIds childObjects,
           ownProperties = mapMaybe getOwnProperty children,
           propertyBindings = bindings
       }
getObject _ _ _ = error "Root is not an object"

indent level = take (level * 4) (repeat ' ')

removeEmpty = mapMaybe (\x -> if length x == 0 then Nothing else Just x)
removeLast x = take ((length x) - 1) x

generateJsForBinding :: Int -> (String, String) -> String
generateJsForBinding indentLevel (key, code) =
    let i1 = indent indentLevel
        stripped = stripSurroundingSpaces code
        hasBraces = code !! 0 == '{'
    in i1 ++ key ++ ": function() " ++ if hasBraces then stripped else "{ return " ++ stripped ++ " }"

generateProperty :: String -> String -> String
generateProperty obj prop =
    indent 1 ++ "addProperty(" ++ obj ++ ", " ++ show prop ++ ");\n"

generateConstructors :: String -> QmlObject -> String
generateConstructors parent obj =
    let i1 = indent 1
        id = objectId obj
        ownProps = ownProperties obj
        propertySetters = if not $ null ownProps
                          then concat (map (generateProperty id) ownProps)
                          else []
        children = childObjects obj
        childConstructors = if not $ null children
                            then concat (map (generateConstructors (", " ++ id)) children)
                            else []
    in i1 ++ "var " ++ id ++ " = createInstance(imports, \"" ++ objectType obj ++ "\"" ++ parent ++ ");\n" ++
       propertySetters ++ childConstructors;

jsForProperty :: Int -> String -> String -> String -> String
jsForProperty indentLevel objectId scopeId property =
    indent indentLevel ++ "addPropertyProxy(" ++ scopeId ++ ", " ++ objectId ++ ", " ++ show property ++ ");\n"

generateBindings :: Int -> QmlObject -> String
generateBindings indentLevel obj =
    let i1 = indent indentLevel
        bindings = propertyBindings obj
        children = childObjects obj
        id = objectId obj
        ownProps = ownProperties obj
        scopeId = id ++ "_scope"
        scope = if not $ null ownProps
                then i1 ++ "var " ++ scopeId ++ " = {};\n" ++
                     concat (map (jsForProperty indentLevel id scopeId) ownProps) ++
                     i1 ++ "with (" ++ scopeId ++ ") {\n"
                else ""
        i2level = indentLevel + if null scope then 0 else 1
        i2 = indent i2level
        jsForBindings = (map (generateJsForBinding (i2level + 1)) bindings)
        core = if not $ null bindings
               then i2 ++ "applyBindings(" ++ id ++ ", {\n" ++
                  concat (intersperse ",\n" jsForBindings) ++
                  "\n" ++ i2 ++ "});\n"
               else ""
    in
        scope ++ core ++
        concat (map (generateBindings i2level) children) ++
        if not $ null scope then i1 ++ "}\n" else ""
    
generateJs :: QmlObject -> String
generateJs obj =
    let i1 = indent 1
        bindings = propertyBindings obj
        children = childObjects obj
    in "function initQml() {\n" ++ i1 ++ "var imports = [ basicelements ];\n" ++
       generateConstructors "" obj ++ generateBindings 1 obj ++ "}\n"

processFile file = do
    x <- readFile file
    putStrLn x
    let y = parseExpr parseQmlValue "qml" x
    y (putStrLn . show)
    let code = y (generateJs . (getObject "" "_qml_id"))
    putStrLn code
    writeFile "qml.js" code

