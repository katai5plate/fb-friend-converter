/// <reference path="./components/FileInput.tsx" />
/// <reference path="./components/DownloadButton.tsx" />
/// <reference path="./components/Pagination.tsx" />
/// <reference path="./components/Article.tsx" />
/// <reference path="./htmlToList.ts" />

const App = () => {
  const [list, setList] = React.useState([] as Friend[]);
  const [error, setError] = React.useState("");
  const [page, setPage] = React.useState(0);
  const chunk = <T extends unknown>(arr: T[], size: number): T[][] =>
    Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
      arr.slice(i * size, i * size + size)
    );
  const onUploadHTML = (e: React.ChangeEvent<HTMLInputElement>) => {
    const reader = new FileReader();
    reader.readAsText(e.target.files[0]);
    reader.onload = () => {
      try {
        const result = htmlToList(reader.result as string);
        setList(result);
        setError("");
      } catch (e) {
        setList([]);
        setError(
          [
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
            (e as Error).stack,
            "Facebook 側の更新により、このツールが使用不能になった場合、\n今後もこのツールを使用することができない可能性があります。",
          ].join("\n\n")
        );
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
  const getFriends = () => list.length !== 0 && chunk<Friend>(list, 10)[page];
  return (
    <section className="section">
      <div className="container">
        <h1 className="title">Facebook 友達コンバーター</h1>
        {list.length === 0 ? (
          <div>
            <FileInput mimetype="text/html" onChange={onUploadHTML}>
              HTML をインポート
            </FileInput>
            <hr />
            {error && <pre>{error}</pre>}
            <pre>
              {list.length === 0
                ? [
                    "1. Facebook でマイページを開く",
                    "2. HTML ファイルを保存する\nchrome の場合:\nページの何もない所を右クリック `名前を付けて保存`\n-> `ウェブページ、完全` で保存",
                    "3. このツールを開き、`ファイルを選択` を押して、先ほど保存した **HTML ファイル** を開く",
                  ].join("\n\n")
                : `${list.length} 人の友達を検出しました。`}
            </pre>
          </div>
        ) : (
          <div>
            <DownloadButton
              list={list}
              mimetype="text/csv"
              filename="friends.csv"
              generate={(_list) =>
                [
                  ['"id"', '"name"', '"image"', '"url"'].join(","),
                  ..._list.map(({ id, name, image, url }) =>
                    [id, name, image, url]
                      .map((x) => `"${x.replace(/"/g, "”")}"`)
                      .join(",")
                  ),
                ].join("\n")
              }
            >
              CSV (UTF-8) をダウンロード
            </DownloadButton>{" "}
            <DownloadButton
              list={list}
              mimetype="text/csv"
              filename="friends.csv"
              generate={(_list) => JSON.stringify(_list)}
            >
              JSON (UTF-8) をダウンロード
            </DownloadButton>
            <hr />
            <Pagination
              page={page}
              length={getFriends().length}
              setPage={setPage}
            />
            {getFriends().map((friend) => (
              <Article friend={friend} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
