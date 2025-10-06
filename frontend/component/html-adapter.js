function configureHtmlJsInterface(navigationPanel, mainPanel) {
  wireUploadButton(navigationPanel);
  wireReformatButton(mainPanel);

}

function wireUploadButton(navigationPanel) {
 document.getElementById('file-load-btn').addEventListener('change', (e) => {
      const file = e.target.files[0];
      console.log(file);
      navigationPanel.loadAndSelectFile(file);

      e.target.value = ''; // reset the file input so that the same file can be re-imported
    })
}

function wireReformatButton(mainPanel) {
  document.getElementById('reformat-btn').addEventListener('click', () => {
    mainPanel.reformat();
  })

}

export { configureHtmlJsInterface };
