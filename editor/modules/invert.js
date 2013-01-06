SsspEditorConfig.AddModule( {
	Name: "Invert",
	Menu: "Color>Invert",
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
			h += '<input type="checkbox" id="'+this.id( "chR" ) +'" onclick="'+editor.getApplyCode()+'" checked> Red<br>';
			h += '<input type="checkbox" id="'+this.id( "chG" ) +'" onclick="'+editor.getApplyCode()+'" checked> Green<br>';
			h += '<input type="checkbox" id="'+this.id( "chB" ) +'" onclick="'+editor.getApplyCode()+'" checked> Blue<br>';
			
			h += editor.getConfirmButton()+" "+editor.getCancelButton();
			
			editor.showToolbox( 'Right', h );
		}
		
		this.Apply = function()
		{
			//Make changes to the currently displayed canvas
			chR = document.getElementById( this.id( "chR") ).checked;
			chG = document.getElementById( this.id( "chG") ).checked;
			chB = document.getElementById( this.id( "chB") ).checked;

			var imgdata = editor.getOriginalData();
			var d = imgdata.data;

			
			for(var i = 0; i < d.length; i += 4) 
			{
				if ( chR ) d[i  ] = 255 - d[i  ];
				if ( chG ) d[i+1] = 255 - d[i+1];
				if ( chB ) d[i+2] = 255 - d[i+2];
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