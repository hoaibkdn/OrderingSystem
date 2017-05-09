$( document ).ready(function() {
  $('#show-btn').click(function() {
    console.log('show button');
    $('#show-btn').toggleClass('chat-btn-confirm');
    setTimeout(function() {
      $('.btn-table__all').toggle();
      $('.btn-table__unpay').toggle();
    }, 200);
  });
});
