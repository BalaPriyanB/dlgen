document.getElementById('dlForm').addEventListener('submit', function(event) {
  event.preventDefault();
  
  const formData = new FormData(this);
  
  fetch('/dl', {
    method: 'POST',
    body: formData
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.text();
  })
  .then(data => {
    console.log('Form submitted successfully:', data);
    // Optionally, redirect the user to the newly created page
    // window.location.href = '/dl/' + data.id + '/' + data.pageName;
  })
  .catch(error => {
    console.error('There was a problem with your form submission:', error);
  });
});
