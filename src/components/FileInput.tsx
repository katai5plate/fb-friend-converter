const FileInput: React.FC<{
  children: string;
  mimetype: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}> = ({ children: label, mimetype, onChange }) => (
  <div className="file">
    <label className="file-label">
      <input
        type="file"
        className="file-input"
        accept={mimetype}
        onChange={onChange}
      ></input>
      <span className="file-cta">
        <span className="file-label">{label}</span>
      </span>
    </label>
  </div>
);
