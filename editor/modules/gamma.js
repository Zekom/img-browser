SsspEditorConfig.AddModule( {
	Name: "Gamma",
	Menu: "Color>Gamma",
	ChangesCanvas: true,
	
	Use: function( editor, moduleId )
	{
		this.editor = editor;
		this.moduleId = moduleId;
		this.id = function( str ) { this.editor.id( this.moduleId+"_"+str); }
		
		this.Invoke = function()
		{
			//Show a toolbox and/or place guide elements on top of the canvas
			
			editor.canvasBackup();
			
			h  = 'Channels:<br>';
			h += '<div><input type="radio" name="'+this.id("mode")+'" value="i" onclick="'+editor.getApplyCode()+'" checked> Independent</div>';
			h += '<div><input type="radio" name="'+this.id("mode")+'" value="c" onclick="'+editor.getApplyCode()+'"> Connected</div>';
			h += '<div><input type="radio" name="'+this.id("mode")+'" value="n" onclick="'+editor.getApplyCode()+'"> Nautral-weighted</div>';
			
			h  += 'Gamma value: <input type="text" value="2.2" size=3 id="'+this.id( "gammaValue") +'" onkeyup="'+editor.getApplyCode()+'"><br>'
			h += editor.getConfirmButton()+" "+editor.getCancelButton();
			
			editor.showToolbox( 'Right', h );
		}
		
		this.Apply = function()
		{
			mode = $('input[name='+this.id("mode")+']:checked').val()
		
			//Make changes to the currently displayed canvas
			el = document.getElementById( this.id( "gammaValue") );
			
			gamma = parseFloat( el.value );			
			gamma = Math.min( 10, Math.max( gamma, 0 ) )
			
			el.value = gamma;
			
			
			var imgdata = editor.getOriginalData();
			var d = imgdata.data;

			
			for(var i = 0; i < d.length; i += 4) 
			{
				if ( mode == "i" )
				{
					d[i] = Math.pow ( 255 * ( d[i] / 255 ), gamma );
					d[i+1] = Math.pow ( 255 * ( d[i+1] / 255 ), gamma );
					d[i+2] = Math.pow ( 255 * ( d[i+2] / 255 ), gamma );
				}
				else if ( mode == "c" )
				{
					f = (d[i] + d[i+1] + d[i+2]) / 3;
					f = Math.pow( 255 * ( f / 255 ), gamma );
					
					d[i] = d[i] * f/255;
					d[i+1] = d[i+1] * f/255;
					d[i+2] = d[i+2] * f/255;
				
				}
				
				else if ( mode == "n" )
				{
				
					f = d[i]*0.299 + d[i+1]*0.587 + d[i+2]*0.144;
					f = Math.pow( 255 * ( f / 255 ), gamma );
					
					d[i] = d[i] * f/255;
					d[i+1] = d[i+1] * f/255;
					d[i+2] = d[i+2] * f/255;
				
				}
				
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