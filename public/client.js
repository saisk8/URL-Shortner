$(document).ready(() => {
  // console.log('yo');
  $('#submit-url').on('click', () => {
    // console.log('sending req');
    const url = `https://bird-work.glitch.me/short/${$('#url').val()}`;
    // console.log(url);
    $('#short-url-result').html('Loading...');
    $.getJSON(url, (data) => {
      console.log(data);
      $('#short-url-result').html(`The JSON response: <br> <code><pre>${JSON.stringify(data, null, 2)}</pre></code>`);
    });
  });
});
