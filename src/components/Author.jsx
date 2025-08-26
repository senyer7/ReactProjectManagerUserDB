export default function Author() {
  const author = "senyer7";
  let telegram__channel = "https://t.me/ars_stu";

  return (
    <footer className="author-footer">
      <div className="author-footer-content">
        <div className="author-info">
          <span className="copyright">© 2025 {author}</span>
          <a
            href={telegram__channel}
            target="_blank"
            rel="noopener noreferrer"
            className="telegram-link"
          >
            Telegram Channel
          </a>
        </div>
      </div>
    </footer>
  );
}
