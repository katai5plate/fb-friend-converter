const Article: React.FC<{ friend: Friend }> = ({
  friend: { id, image, name, url },
}) => (
  <a href={url} key={id}>
    <article className="media">
      <div className="media-left">
        <p className="image is-64x64">
          <img src={image} />
        </p>
      </div>
      <div className="media-content">
        <p style={{ fontSize: "x-large" }}>{name}</p>
      </div>
    </article>
  </a>
);
