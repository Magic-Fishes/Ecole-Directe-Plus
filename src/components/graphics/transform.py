import xml.etree.ElementTree as ET
import os

removeFromRoot = ["width", "height", "xmlns:xlink"]
remove = ["style"]

style = {}
svgInlineStyle = []

definedColors = {
    "white": "text-main",
    "black": "text-main",
    "#ffffff": "text-main",
    "#fff": "text-main",
    "#FFFFFF": "text-main",
    "#FFF": "text-main",
    "#181829": "background-0",
    "#4B48D9": "border-0",
    "#6865EC": "border-1",
    "#39378F": "background-header",
    "#B4B4F0": "text-alt",
    "#dfc8c8": "text-soft-error-main",
    "#323257": "canardman-main",
} 

def kebabToCamel(str):
    while "-" in str:
        str = str[:str.index("-")] + str[str.index("-") + 1].upper() + str[str.index("-") + 2:]
    return str

def colorsToCSSVar(txt):
    defined = {
        "text-main": "--text-color-main",
        "background-0": "--background-color-0",
        "border-0": "--border-color-0",
        "border-1": "--border-color-1",
        "background-header": "--background-color-header",
        "text-alt": "--text-color-alt",
        "text-soft-error-main": "--text-color-soft-error-main",
        "canardman-main": "--background-color-canarman-main",
    }
    if txt in defined:
        return "rgb(var(" + defined[txt] + "))"
    else:
        return txt

def modifyChildren(parent):
    for child in parent:
        className = ""
        remove = []
        removeFromParent = []
        replace = {}
        tag = child.tag
        tag = tag[tag.index("}")+1:]
        if tag == "svg":
            for i in removeFromRoot:
                try:
                    child.attrib.pop(i)
                except:
                    pass
        
        if tag == "style":
            svgInlineStyle.append(child.text)

        # for i in remove:
        #     try:
        #         child.attrib.pop(i)
        #     except:
        #         pass

        for i in child.attrib:
            if "-" in i:
                replace[i] = kebabToCamel(i)
            if not child.attrib[i].replace("none", ""):
                pass

            elif i == "fill":
                fill = child.attrib[i]
                if fill in definedColors:
                    fill = definedColors[fill]
                remove.append(i)
                if fill in style:
                    if not "fill" in style[fill]:
                        style[fill].append("fill")
                else:
                    style[fill] = ["fill"]
                className += "fill-" + fill

            elif i == "stroke":
                stroke = child.attrib[i]
                if stroke in definedColors:
                    stroke = definedColors[stroke]
                remove.append(i)
                if stroke in style:
                    if not "stroke" in style[stroke]:
                        style[stroke].append("stroke")
                else:
                    style[stroke] = ["stroke"]
                if className:
                    className += " "
                className += "stroke-" + stroke

        if className:
            child.attrib["className"] = className.replace("#", "")

        for i in remove:
            child.attrib.pop(i)

        for i in replace:
            value = child.attrib.pop(i)
            child.attrib[replace[i]] = value

        if len(child):
            modifyChildren(child)

route = "./public/images/new/"
for i in os.listdir(route):
    if i[i.index("."):] == ".svg":
        fileName = i.replace(".svg", "")
        fileName = fileName[0].upper() + fileName[1:]
        fileName = kebabToCamel(fileName)
        inlineFile = """
import "./graphics.css"
export default function """ + fileName + """ ({ className="", id="", alt, ...props }) {
    return (
"""
        tree = ET.parse(route + i)
        root = [tree.getroot()]
        modifyChildren(root)
        root = root[0]
        
        # convert as a string for last formating and writing it in file
        svgFile = ET.tostring(root, encoding="utf-8", method="xml").decode()
        
        # average text modifications to add jsx specifications
        svgFile = svgFile.replace("ns0:", "").replace(":ns0", "")
        svgFile = svgFile.replace("<svg", "<svg aria-label={alt} className={className} id={id}")
        svgFile = svgFile.replace('fill="none">', 'fill="none" {...props}>')
        
        try:
            styleBalise1 = svgFile.index("<style")
            styleBalise2 = svgFile.index("</style>") + 8
            svgFile = svgFile[:styleBalise1] + svgFile[styleBalise2:]
        except ValueError:
            pass
        
        with open("./src/components/graphics/" + fileName + ".jsx", "w") as f:
            f.write(inlineFile + svgFile + "\n\t)\n}")

cssFile = ""

with open("./src/components/graphics/graphics.css", "r") as css:
    cssFile = css.read()

with open("./src/components/graphics/graphics.css", "w") as css:
    css.write(cssFile)
    for i in style:
        for n in style[i]:
            writedCss = "." + n + "-" + i.strip("#") + """ {
    """ + n + ": " + colorsToCSSVar(i) + """;
}

"""
        if not writedCss in cssFile:
            print(writedCss)
            css.write(writedCss)

    for i in svgInlineStyle:
        if not i in cssFile:
            css.write(i)

print("svg successfully turned into react.js component")