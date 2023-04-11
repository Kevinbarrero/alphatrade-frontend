export default function authHeader() {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user && user.token && user._id) {
    // for Node.js Express back-end
    return { 'token': user.token, '_id': user._id };
  } else {
    return {};
  }
}
