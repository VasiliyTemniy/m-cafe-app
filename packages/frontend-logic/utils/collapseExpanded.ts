export const collapseExpanded = () => {
  const dropboxes = Array.from(document.getElementsByClassName('expanded'));
  for (const dropbox of dropboxes) {
    dropbox.classList.remove('expanded');
  }
};