SsspEditorConfig.AddModule( {
	Name: "Histogram",
	Menu: "Info>Histogram",
	ChangesCanvas: true,
	
	Use: function( editor, moduleId )
	{
		this.editor = editor;
		this.moduleId = moduleId;
		this.id = function( str ) { return this.editor.id( this.moduleId+"_"+str); }
		
		this.Invoke = function()
		{
			//Show a toolbox and/or place guide elements on top of the canvas
			
			editor.canvasBackup();
			
			
			h  = 'Channel:<br>';
			h += '<div><input type="radio" name="'+this.id("channel")+'" value="a" onclick="'+editor.getApplyCode()+'" checked> All</div>';
			h += '<div><input type="radio" name="'+this.id("channel")+'" value="r" onclick="'+editor.getApplyCode()+'"> Red</div>';
			h += '<div><input type="radio" name="'+this.id("channel")+'" value="g" onclick="'+editor.getApplyCode()+'"> Green</div>';
			h += '<div><input type="radio" name="'+this.id("channel")+'" value="b" onclick="'+editor.getApplyCode()+'"> Blue</div>';
			h += '<br><br>';
			h += '<canvas width=150 height=100 style="border:2px grey inset;" id="'+this.id("histogram")+'"></canvas><br>';
			
			h += editor.getCancelButton();
			
			editor.showToolbox( 'Right', h );
			
			
			
		}
		
		this.Apply = function()
		{
			//Make changes to the currently displayed canvas
			
			channel = $('input[name='+this.id("channel")+']:checked').val()
			hEl = document.getElementById( this.id("histogram") );
			
			histWidth = Math.round( hEl.width  );
			
			var imgdata = editor.getOriginalData();
			var d = imgdata.data;

			hist = new Array();
			for( i = 0; i < 255; i++ )
				hist.push( 0 );
			
			chIdx = 3;
			if ( channel == "r" ) chIdx = 0;
			if ( channel == "g" ) chIdx = 1;
			if ( channel == "b" ) chIdx = 2;
			
			for(var i = 0; i < d.length; i += 4) 
			{
				v = 0;
				
				if ( chIdx == 3 )
					v = (d[i+0] + d[i+1] + d[i+2]) / 3
				else
					v = d[i+chIdx]
				
				hIdx =  Math.round( v );
				
				
				
				hist[hIdx]++;
			}
			
			/*for( i = 0; i < 100; i++ )
			{
				hist[hIdx] = hist[hIdx]
			}*/
			

			histMax = 0;
			for( i = 0; i < histWidth; i++ )
			{
				if ( hist[i] > histMax )
					histMax = hist[i]
			}
			
			ctx = hEl.getContext("2d");
			
			ctx.clearRect( 0, 0, hEl.width, hEl.height );
			
			histColors = [ "#880000", "#007700", "#000099", "#777777" ];
			
			ctx.strokeStyle = histColors[ chIdx ] ;
			ctx.lineWidth = 1;
			

			for( i = 0; i < 255; i++ )
			{
				//alert("at "+i+" theres "+hEl[i]);
				ctx.beginPath();
				ctx.moveTo( i /255 * histWidth, hEl.height  );
				
				ctx.lineTo( i /255 * histWidth, hEl.height - hist[i]/histMax*hEl.height*0.95);
				ctx.stroke();
			
			}
			
			
			
			
			imgdata.data = d;
			editor.setDisplayedData( imgdata );
		}
		

		this.Destroy = function()
		{
			//Remove extra elements that may have been placed over the canvas at Invoke()
			editor.hideToolbox( 'Right' );
		}
	}
});