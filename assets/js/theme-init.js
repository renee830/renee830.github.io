(() => {
  try {
    const theme = window.localStorage.getItem("portfolio-theme");
    if (theme === "light" || theme === "dark") {
      document.documentElement.dataset.theme = theme;
      const themeColor = document.querySelector('meta[name="theme-color"]');
      if (themeColor) themeColor.content = theme === "dark" ? "#313131" : "#f6f6f6";
    }
  } catch (error) {
    console.warn("Could not load the saved color theme.", error);
  }
})();
