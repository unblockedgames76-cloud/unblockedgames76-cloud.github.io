@extends('layouts.home')
@section('title')
Webstie Đọc truyện online HSTORY
@endsection
@section('main')

<aside class="owl-carousel owl-theme">
    <div class="item"><h4>1</h4></div>
    <div class="item"><h4>2</h4></div>
    <div class="item"><h4>3</h4></div>
    <div class="item"><h4>4</h4></div>
    <div class="item"><h4>5</h4></div>
    <div class="item"><h4>6</h4></div>
    <div class="item"><h4>7</h4></div>
    <div class="item"><h4>8</h4></div>
    <div class="item"><h4>9</h4></div>
    <div class="item"><h4>10</h4></div>
    <div class="item"><h4>11</h4></div>
    <div class="item"><h4>12</h4></div>
</aside>


@endsection
@section('js')
<script src="{{asset('js/main.js')}}"></script>

<script>
    $(function () {
        $('.owl-carousel').owlCarousel({
            loop:true,
            margin:10,
            nav:true,
            dot:true,
            responsive:{
                0:{
                    items:1
                },
                600:{
                    items:3
                },
                1000:{
                    items:5
                }
            }
        })
    });
    $('.visited-link').click(function(){
        const image = $(this).find('.image_history').val();
        const id = $(this).find('.id_history').val();
        const title = $(this).find('.title_history').val();
        const url = $(this).find('.url_history').val();
        const urlChap = $(this).attr('href');
        var items = JSON.parse(localStorage.getItem('history_list')) || [];
      // add to it, only if it's empty
        var item = items.find(item => item.id === id);

          if (item) {
            item.urlChap = urlChap;
          } else {
            items.push({
              id,image,title,url,urlChap
            })
          }
          localStorage.setItem('history_list', JSON.stringify(items));
    });
</script>
@endsection
