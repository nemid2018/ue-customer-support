// Restores the original URL after GitHub Pages 404 redirect.
// See public/404.html for the other half of this mechanism.
var redirect = sessionStorage.redirect;
delete sessionStorage.redirect;
if (redirect && redirect !== location.href) {
  history.replaceState(null, null, redirect);
}
