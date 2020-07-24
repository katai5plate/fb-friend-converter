const Pagination: React.FC<{
  page: number;
  length: number;
  setPage: (p: number) => void;
}> = ({ page, length, setPage }) => (
  <nav className="pagination" role="navigation" aria-label="pagination">
    <button
      className="button"
      disabled={page === 0}
      onClick={() => setPage(page - 1)}
    >
      前へ
    </button>
    <button
      className="button"
      disabled={page === length - 1}
      onClick={() => setPage(page + 1)}
    >
      次へ
    </button>
    <ul className="pagination-list">
      <li>
        <button className="pagination-link" onClick={() => setPage(0)}>
          0
        </button>
      </li>
      <li>
        <span className="pagination-ellipsis">&hellip;</span>
      </li>
      <li>
        <button className="pagination-link is-current">{page}</button>
      </li>
      <li>
        <span className="pagination-ellipsis">&hellip;</span>
      </li>
      <li>
        <button className="pagination-link" onClick={() => setPage(length - 1)}>
          {length - 1}
        </button>
      </li>
    </ul>
  </nav>
);
