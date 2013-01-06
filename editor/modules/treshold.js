SsspEditorConfig.AddModule( {
	Name: "Treshold",
	Menu: "Color>Treshold",
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
			
			h  = 'Treshold value: <input type="text" value="128" size=3 id="'+this.id( "tresholdValue") +'" onkeyup="'+editor.getApplyCode()+'">'
			h += editor.getConfirmButton()+" "+editor.getCancelButton();
			
			editor.showToolbox( 'Top', h );
		}
		
		this.Apply = function()
		{
			//Make changes to the currently displayed canvas
			el = document.getElementById( this.id( "tresholdValue") );
			
			thold = parseInt( el.value );			
			thold = Math.min( 255, Math.max( thold, 0 ) )
			
			el.value = thold;
			
			
			var imgdata = editor.getOriginalData();
			var d = imgdata.data;

			
			for(var i = 0; i < d.length; i += 4) 
			{
				f=(d[i]+d[i+1]+d[i+2])/3;
				f = ( f > thold ? 255 : 0 );
				d[i]=f; d[i+1]=f; d[i+2]=f; 
			}
			imgdata.data = d;
			editor.setDisplayedData( imgdata );
		}
		

		this.Destroy = function()
		{
			//Remove extra elements that may have been placed over the canvas at Invoke()
			editor.hideToolbox( 'Top' );
		}
	}
});