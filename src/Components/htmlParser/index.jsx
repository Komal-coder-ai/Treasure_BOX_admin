import HTMLReactParser from "html-react-parser";
import "./index.css"

const RemoveTag = ({ ParserText, className }) => {
    const html = ParserText;
    return HTMLReactParser(`<div className=${className}>${html}</div>`)
}
export default RemoveTag