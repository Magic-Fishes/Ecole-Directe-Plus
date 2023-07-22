import xml.etree.ElementTree as ET
import os

removeFromRoot = ["width", "height", "xmlns:xlink"]
remove = ["style"]

style = {}

definedColors = {
    "white": "text-main",
    "#ffffff": "text-main",
    "#181829": "background-0",
    "#4B48D9": "border-0",
    "#6865EC": "border-1",
    "#39378F": "background-header",
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
    }
    if txt in defined:
        return "rgb(var(" + defined[txt] + "))"
    else:
        return txt

def modifyChildren(parent):
    for child in parent:
        className = ""
        remove = []
        replace = {}
        tag = child.tag
        tag = tag[tag.index("}")+1:]
        if tag == "svg":
            for i in removeFromRoot:
                try:
                    child.attrib.pop(i)
                except:
                    pass

        for i in remove:
            try:
                child.attrib.pop(i)
            except:
                pass

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

route = "./images/"
for i in os.listdir(route):
    if i[i.index("."):] == ".svg":
        fileName = i.replace(".svg", "")
        fileName = fileName[0].upper() + fileName[1:]
        fileName = kebabToCamel(fileName)
        inlineFile = """
import "./graphics.css"
export default function """ + fileName + """ ({ className, id, alt }) {
    return (
"""
        tree = ET.parse(route + i)
        root = [tree.getroot()]
        modifyChildren(root)
        root = root[0] # g pas envie de parler de ça tllmt g fait n'imp là dessus mais aled
        title = ET.Element("title")
        title.text = "{alt}"
        root.insert(0, title)

        # convert as a str
        svgFile = ET.tostring(root, encoding="utf-8", method="xml").decode()

        # average text modifications to add jsx specifications
        svgFile = svgFile.replace("ns0:", "").replace(":ns0", "")
        svgFile = svgFile.replace("<svg", "<svg className={className} id={id}")
        svgFile = svgFile.replace("</title>", "</title>\n")

        with open("./src/inline/" + fileName + ".jsx", "w") as f:
            f.write(inlineFile + svgFile + "\n\t)\n}")

print(style)

with open("./src/graphics.css", "w") as css:
    for i in style:
        for n in style[i]:
            css.write("." + n + "-" + i.strip("#") + """ {
    """ + n + ": " + colorsToCSSVar(i) + """;
}

""")