const download = async () => {
  fetch('http://localhost:4000/api/admin/exportRequestsExcel', {
    method: 'POST',
    headers: {
      Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwidWlkIjoxLCJyb2xlIjoyfQ.2hiaMK3KSygvX5JLDvBWDQlKiU-RUKRN7p_9IQkf6Rs`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      period: 'ALL',
      password: '',
    }),
  })
    .then((response) => response.blob())
    .then((blob) => {
      var url = window.URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url;
      a.download = 'filename.xlsx';
      document.body.appendChild(a);
      a.click();
      a.remove();
    });
};

download();
