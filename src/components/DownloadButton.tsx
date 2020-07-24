const DownloadButton: React.FC<{
  children: string;
  list: Friend[];
  mimetype: string;
  filename: string;
  generate: (list: Friend[]) => string;
}> = ({ children, list, mimetype: type, filename, generate }) => (
  <button
    className="button is-primary"
    onClick={() => {
      const url = (window.URL || window.webkitURL).createObjectURL(
        new Blob([generate(list)], { type })
      );
      const a = document.createElement("a");
      a.target = "_blank";
      a.download = filename;
      a.href = url;
      a.click();
    }}
  >
    {children}
  </button>
);
