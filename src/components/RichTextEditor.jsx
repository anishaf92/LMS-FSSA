import React, { useState } from "react";

function RichTextEditor({ onSave, initialContent = "" }) {
    const [content, setContent] = useState(initialContent);
    const [showPreview, setShowPreview] = useState(false);

    const insertImage = () => {
        const imageUrl = prompt("Enter image URL:");
        if (imageUrl) {
            setContent(content + `\n![Image](${imageUrl})\n`);
        }
    };

    const insertCodeBlock = () => {
        const language = prompt("Enter language (javascript, python, etc.):", "javascript");
        if (language !== null) {
            setContent(
                content + `\n\`\`\`${language}\n// Your code here\n\`\`\`\n`
            );
        }
    };

    const insertHeading = (level) => {
        const heading = "#".repeat(level) + " Heading";
        setContent(content + "\n" + heading + "\n");
    };

    const insertList = () => {
        setContent(content + "\n- Item 1\n- Item 2\n- Item 3\n");
    };

    const makeBold = () => {
        setContent(content + "**bold text**");
    };

    const makeItalic = () => {
        setContent(content + "*italic text*");
    };

    return (
        <div className="border rounded-lg p-4 bg-white">
            {/* Toolbar */}
            <div className="mb-4 flex flex-wrap gap-2 border-b pb-3">
                <button
                    onClick={makeBold}
                    className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded font-bold"
                    title="Bold"
                >
                    B
                </button>
                <button
                    onClick={makeItalic}
                    className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded italic"
                    title="Italic"
                >
                    I
                </button>

                <div className="w-px bg-gray-300"></div>

                <button
                    onClick={() => insertHeading(1)}
                    className="px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded text-sm"
                    title="Heading 1"
                >
                    H1
                </button>
                <button
                    onClick={() => insertHeading(2)}
                    className="px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded text-sm"
                    title="Heading 2"
                >
                    H2
                </button>
                <button
                    onClick={() => insertHeading(3)}
                    className="px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded text-sm"
                    title="Heading 3"
                >
                    H3
                </button>

                <div className="w-px bg-gray-300"></div>

                <button
                    onClick={insertList}
                    className="px-3 py-1 bg-blue-100 hover:bg-blue-200 rounded text-sm"
                    title="Insert List"
                >
                    📝 List
                </button>
                <button
                    onClick={insertImage}
                    className="px-3 py-1 bg-blue-100 hover:bg-blue-200 rounded text-sm"
                    title="Insert Image"
                >
                    🖼️ Image
                </button>
                <button
                    onClick={insertCodeBlock}
                    className="px-3 py-1 bg-blue-100 hover:bg-blue-200 rounded text-sm"
                    title="Insert Code Block"
                >
                    &lt;/&gt; Code
                </button>

                <div className="ml-auto">
                    <button
                        onClick={() => setShowPreview(!showPreview)}
                        className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded text-sm"
                    >
                        {showPreview ? "Edit" : "Preview"}
                    </button>
                </div>
            </div>

            {/* Editor/Preview */}
            {!showPreview ? (
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full h-64 p-3 border rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Write your content here... Use markdown format"
                />
            ) : (
                <div className="w-full h-64 p-3 border rounded bg-gray-50 overflow-auto">
                    <MarkdownPreview content={content} />
                </div>
            )}

            {/* Action Buttons */}
            <div className="mt-4 flex gap-2 justify-end">
                <button
                    onClick={() => setContent("")}
                    className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded text-sm"
                >
                    Clear
                </button>
                <button
                    onClick={() => onSave(content)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm"
                >
                    Save Content
                </button>
            </div>
        </div>
    );
}

// Simple Markdown Preview Component
function MarkdownPreview({ content }) {
    const lines = content.split("\n");

    return (
        <div className="prose prose-sm max-w-none">
            {lines.map((line, idx) => {
                if (line.startsWith("# ")) {
                    return <h1 key={idx} className="text-2xl font-bold mb-2">{line.slice(2)}</h1>;
                }
                if (line.startsWith("## ")) {
                    return <h2 key={idx} className="text-xl font-bold mb-2">{line.slice(3)}</h2>;
                }
                if (line.startsWith("### ")) {
                    return <h3 key={idx} className="text-lg font-bold mb-2">{line.slice(4)}</h3>;
                }
                if (line.startsWith("- ")) {
                    return <li key={idx} className="ml-4 mb-1">{line.slice(2)}</li>;
                }
                if (line.startsWith("![")) {
                    const match = line.match(/!\[.*?\]\((.*?)\)/);
                    if (match) {
                        return <img key={idx} src={match[1]} alt="content" className="max-w-full h-auto mb-2" />;
                    }
                }
                if (line.startsWith("```")) {
                    return null;
                }
                if (line.includes("**")) {
                    return <p key={idx} className="mb-2">{line.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")}</p>;
                }
                return line ? <p key={idx} className="mb-2">{line}</p> : <br key={idx} />;
            })}
        </div>
    );
}

export default RichTextEditor;
