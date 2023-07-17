function Copyright() {
  const currentYear = new Date().getFullYear();

  return (
    <footer>
      <div className="copyright">
        <p>&copy; {currentYear} Antônio Brandão Lima.</p>
      </div>
    </footer>
  );
}

export default Copyright;
