<?php // Glavni dokument //?>
<html xmlns="http://www.w3.org/1999/xhtml" >
  <head>
    <title>jQuery Resize And Crop (jrac) example</title>
    
    <!-- jQuery -->
    <script type="text/javascript" src="http://code.jquery.com/jquery-1.6.2.js"></script>
    
    <!-- jQuery-Ui -->
    <link rel="stylesheet" type="text/css" href="http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.7/themes/base/jquery-ui.css" />
    <script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jqueryui/1.8.7/jquery-ui.js"></script>
    
    <!-- jrac - jQuery Resize And Crop -->
    <link rel="stylesheet" type="text/css" href="./include/jrac/jrac/style.jrac.css" />
    <script type="text/javascript" src="./include/jrac/jrac/jquery.jrac.js"></script>
    
    <!-- This page business -->
    <link rel="stylesheet" type="text/css" href="style.css" />
    
    <script type="text/javascript">
      <!--//--><![CDATA[//><!--
      $(document).ready(function(){
        // Apply jrac on some image.
        $('.pane img').jrac({
          'crop_width': 250,
          'crop_height': 170,
          'crop_x': 100,
          'crop_y': 100,
          'image_width': 400,
          'viewport_onload': function() {
            var $viewport = this;
            var inputs = $viewport.$container.parent('.pane').find('.coords input:text');
            var events = ['jrac_crop_x','jrac_crop_y','jrac_crop_width','jrac_crop_height','jrac_image_width','jrac_image_height'];
            for (var i = 0; i < events.length; i++) {
              var event_name = events[i];
              // Register an event with an element.
              $viewport.observator.register(event_name, inputs.eq(i));
              // Attach a handler to that event for the element.
              inputs.eq(i).bind(event_name, function(event, $viewport, value) {
                $(this).val(value);
              })
              // Attach a handler for the built-in jQuery change event, handler
              // which read user input and apply it to relevent viewport object.
              .change(event_name, function(event) {
                var event_name = event.data;
                $viewport.$image.scale_proportion_locked = $viewport.$container.parent('.pane').find('.coords input:checkbox').is(':checked');
                $viewport.observator.set_property(event_name,$(this).val());
              });
            }
            $viewport.$container.append('<div>Image natual size: '
              +$viewport.$image.originalWidth+' x '
              +$viewport.$image.originalHeight+'</div>')
          }
        })
        // React on all viewport events.
        .bind('jrac_events', function(event, $viewport) {
          var inputs = $(this).parents('.pane').find('.coords input');
          inputs.css('background-color',($viewport.observator.crop_consistent())?'chartreuse':'salmon');
        });
      });
      //--><!]]>
    </script>
  </head>
  <body>
 
    <?php include ('function/upload.php')?>    
    <?php include ('function/browse.php')?>
    
    <h1>jQuery Resize and Crop (jrac)</h1>
    <p>jQuery Resize And Crop (jrac) is a jQuery plugin that build a viewport around a
given image permitting to visually resize an image and place a crop. Then it is
possible to use the coordinates data to be used for any purpose.</p>
    <h2>Demo</h2>
    <p>Move the image or the crop with the pointer, resize the crop with the pointer, use the zoom bar to scale the image or set your values into the inputs.</p>
    <div class="pane clearfix">
      <img src="images/spider.jpg" alt="Seminarska naloga" />
      <table class="coords">
        <tr><td>crop x</td><td><input type="text" /></td></tr>
        <tr><td>crop y</td><td><input type="text" /></td></tr>
        <tr><td>crop width</td><td><input type="text" /></td></tr>
        <tr><td>crop height</td><td><input type="text" /></td></tr>
        <tr><td>image width</td><td><input type="text" /></td></tr>
        <tr><td>image height</td><td><input type="text" /></td></tr>
        <tr><td>lock proportion</td><td><input type="checkbox" checked="checked" /></td></tr>
      </table>
    </div>
    
    <?php include('function/preview.php') ?>
    <?php include('function/effects.php') ?>
    
    <h2>Download</h2>    
    <a href="https://github.com/trepmag/jrac">https://github.com/trepmag/jrac</a>
    
    ZekomZ - Zekom Tribute Magazine - G+
    https://github.com/Zekom
    Zekom. It's the Law.
    
  </body>
</html>
