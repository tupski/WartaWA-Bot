document.addEventListener("DOMContentLoaded", function () {
    const profileBtn = document.getElementById('profile-btn');
    const dropdownMenu = document.getElementById('dropdown');
  
    profileBtn.addEventListener('click', function () {
      dropdownMenu.classList.toggle('hidden');
    });
  
    // Close the dropdown if clicked outside
    document.addEventListener('click', function (e) {
      if (!profileBtn.contains(e.target) && !dropdownMenu.contains(e.target)) {
        dropdownMenu.classList.add('hidden');
      }
    });
  
    // Logout behavior (Replace with actual logout logic)
    const logoutOption = dropdownMenu.querySelector('div');
    logoutOption.addEventListener('click', function () {
      alert('Logged out!');
      dropdownMenu.classList.add('hidden');
      // You can redirect or implement your logout logic here
    });
  });
  