// (function() {
//   var x = document.getElementsByTagName('section');
//   console.log('menu ', x.className);
//   console.log('inner js', $('section').attr('class'));
//   $('.menu').on('click', '.type-down', function(event) {
//     console.log('inner js');
//   });
//   $('a[class=type-down]').on('click',function(event) {
//     console.log('inner js');
//     event.preventDefault();
//     $('html, body').animate(
//       { scrollTop: $($(this).attr('href')).offset().top}, 500, 'linear');
//   });
// })();
