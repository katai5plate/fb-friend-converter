var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
const FileInput = ({ children: label, mimetype, onChange }) => (React.createElement("div", { className: "file" },
    React.createElement("label", { className: "file-label" },
        React.createElement("input", { type: "file", className: "file-input", accept: mimetype, onChange: onChange }),
        React.createElement("span", { className: "file-cta" },
            React.createElement("span", { className: "file-label" }, label)))));
const DownloadButton = ({ children, list, mimetype: type, filename, generate }) => (React.createElement("button", { className: "button is-primary", onClick: () => {
        const url = (window.URL || window.webkitURL).createObjectURL(new Blob([generate(list)], { type }));
        const a = document.createElement("a");
        a.target = "_blank";
        a.download = filename;
        a.href = url;
        a.click();
    } }, children));
const Pagination = ({ page, length, setPage }) => (React.createElement("nav", { className: "pagination", role: "navigation", "aria-label": "pagination" },
    React.createElement("button", { className: "button", disabled: page === 0, onClick: () => setPage(page - 1) }, "\u524D\u3078"),
    React.createElement("button", { className: "button", disabled: page === length - 1, onClick: () => setPage(page + 1) }, "\u6B21\u3078"),
    React.createElement("ul", { className: "pagination-list" },
        React.createElement("li", null,
            React.createElement("button", { className: "pagination-link", onClick: () => setPage(0) }, "0")),
        React.createElement("li", null,
            React.createElement("span", { className: "pagination-ellipsis" }, "\u2026")),
        React.createElement("li", null,
            React.createElement("button", { className: "pagination-link is-current" }, page)),
        React.createElement("li", null,
            React.createElement("span", { className: "pagination-ellipsis" }, "\u2026")),
        React.createElement("li", null,
            React.createElement("button", { className: "pagination-link", onClick: () => setPage(length - 1) }, length - 1)))));
const Article = ({ friend: { id, image, name, url }, }) => (React.createElement("a", { href: url, key: id },
    React.createElement("article", { className: "media" },
        React.createElement("div", { className: "media-left" },
            React.createElement("p", { className: "image is-64x64" },
                React.createElement("img", { src: image }))),
        React.createElement("div", { className: "media-content" },
            React.createElement("p", { style: { fontSize: "x-large" } }, name)))));
const htmlToList = (html) => {
    const plainData = html
        .split("\n")
        .filter((x) => x.match(/\[\"adp_PresenceStatusProviderSubscriptionComponentQueryRelayPreloader_[\dabcdef]/))[0]
        .match(/\,(\{\"__bbox.*?)\]\]\]\}\);/)[1];
    const parsedData = JSON.parse(plainData).__bbox.result.data.viewer
        .chat_sidebar_contact_rankings;
    return [
        ...new Set(parsedData
            .map((_a) => {
            var { status } = _a, rest = __rest(_a, ["status"]);
            return rest;
        })
            .map((x) => JSON.stringify(x))),
    ]
        .map((x) => JSON.parse(x))
        .filter((x) => x.user) // 退会ユーザを除外
        .map(({ user: { id, name, profile_picture: { uri: image } } }) => ({
        id,
        name,
        image,
        url: `https://www.facebook.com/profile.php?id=${id}`,
    }));
};
/// <reference path="./components/FileInput.tsx" />
/// <reference path="./components/DownloadButton.tsx" />
/// <reference path="./components/Pagination.tsx" />
/// <reference path="./components/Article.tsx" />
/// <reference path="./htmlToList.ts" />
const App = () => {
    const [list, setList] = React.useState([]);
    const [error, setError] = React.useState("");
    const [page, setPage] = React.useState(0);
    const chunk = (arr, size) => Array.from({ length: Math.ceil(arr.length / size) }, (v, i) => arr.slice(i * size, i * size + size));
    const onUploadHTML = (e) => {
        const reader = new FileReader();
        reader.readAsText(e.target.files[0]);
        reader.onload = () => {
            try {
                const result = htmlToList(reader.result);
                setList(result);
                setError("");
            }
            catch (e) {
                setList([]);
                setError([
                    "友達リストを取得できませんでした",
                    "考えられる原因:",
                    [
                        "間違ったファイルを読み込んだ",
                        "間違った HTML を読み込んだ",
                        "間違った手順で保存した HTML を読み込んだ",
                        "Facebook 側が HTML のフォーマットを変更した",
                        "Facebook の更新により、このツールが使用不能になっている",
                        "何らかのバグが発生した",
                    ]
                        .map((x) => `- ${x}`)
                        .join("\n"),
                    e.stack,
                    "Facebook 側の更新により、このツールが使用不能になった場合、\n今後もこのツールを使用することができない可能性があります。",
                ].join("\n\n"));
            }
        };
        reader.onerror = () => {
            setList([]);
            setError("ファイルの読み込みに失敗しました");
        };
    };
    React.useEffect(() => {
        console.log(list);
    });
    const getFriends = () => list.length !== 0 && chunk(list, 10)[page];
    return (React.createElement("section", { className: "section" },
        React.createElement("div", { className: "container" },
            React.createElement("h1", { className: "title" }, "Facebook \u53CB\u9054\u30B3\u30F3\u30D0\u30FC\u30BF\u30FC"),
            list.length === 0 ? (React.createElement("div", null,
                React.createElement(FileInput, { mimetype: "text/html", onChange: onUploadHTML }, "HTML \u3092\u30A4\u30F3\u30DD\u30FC\u30C8"),
                React.createElement("hr", null),
                error && React.createElement("pre", null, error),
                React.createElement("pre", null, list.length === 0
                    ? [
                        "1. Facebook でマイページを開く",
                        "2. HTML ファイルを保存する\nchrome の場合:\nページの何もない所を右クリック `名前を付けて保存`\n-> `ウェブページ、完全` で保存",
                        "3. このツールを開き、`ファイルを選択` を押して、先ほど保存した **HTML ファイル** を開く",
                    ].join("\n\n")
                    : `${list.length} 人の友達を検出しました。`))) : (React.createElement("div", null,
                React.createElement(DownloadButton, { list: list, mimetype: "text/csv", filename: "friends.csv", generate: (_list) => [
                        ['"id"', '"name"', '"image"', '"url"'].join(","),
                        ..._list.map(({ id, name, image, url }) => [id, name, image, url]
                            .map((x) => `"${x.replace(/"/g, "”")}"`)
                            .join(",")),
                    ].join("\n") }, "CSV (UTF-8) \u3092\u30C0\u30A6\u30F3\u30ED\u30FC\u30C9"),
                " ",
                React.createElement(DownloadButton, { list: list, mimetype: "text/csv", filename: "friends.csv", generate: (_list) => JSON.stringify(_list) }, "JSON (UTF-8) \u3092\u30C0\u30A6\u30F3\u30ED\u30FC\u30C9"),
                React.createElement("hr", null),
                React.createElement(Pagination, { page: page, length: getFriends().length, setPage: setPage }),
                getFriends().map((friend) => (React.createElement(Article, { friend: friend }))))))));
};
/// <reference path="./App.tsx" />
ReactDOM.render(React.createElement(App, null), document.getElementById("app"));
