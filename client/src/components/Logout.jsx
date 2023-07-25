export default function Logout () {
    if (localStorage.getItem('token')) {
        localStorage.clear();
        window.location.replace('http://localhost:3000/');
    }
}
