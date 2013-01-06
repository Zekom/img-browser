SsspEditorConfig.AddModule( {
	Name: "Monochrome",
	Menu: "Color>Monochrome",
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
			
			
			h  = 'Channels:<br>';
			h += '<div><input type="radio" name="'+this.id("mode")+'" value="s" onclick="'+editor.getApplyCode()+'" checked> Simple</div>';
			h += '<div><input type="radio" name="'+this.id("mode")+'" value="n" onclick="'+editor.getApplyCode()+'"> Natural</div>';
			
			h += editor.getConfirmButton()+" "+editor.getCancelButton();
			
			editor.showToolbox( 'Right', h );
			
		}
		
		this.Apply = function()
		{
			//Make changes to the currently displayed canvas
			
			mode = $('input[name='+this.id("mode")+']:checked').val()

			var imgdata = editor.getOriginalData();
			var d = imgdata.data;

			f = [ 1/3, 1/3, 1/3 ];
			
			if ( mode == "n" )
			f = [ 0.299, 0.587, 0.144 ];

			
			for(var i = 0; i < d.length; i += 4) 
			{
				val = d[i  ] * f[0] + d[i+1] * f[1]  + d[i+2] * f[2];
				d[i  ] = val;
				d[i+1] = val;
				d[i+2] = val;
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