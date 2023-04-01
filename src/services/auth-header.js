export default function authHeader() {
    const user = JSON.parse(localStorage.getItem('user'));
  
    if (user && user.accessToken) {
      // for Node.js Express back-end
      return { 'token': user.accessToken };
    } else {
      return {};
    }
  }
  