function membersOf( v )
{
	count = 0;
	for( m in v )
		count++;
		
	alert("Object "+v+" has "+count+" members:");
	
	for( m in v )
		alert( "'"+m+"' = '"+v[m]+"' ");
	
}


function SsspEditorConfig() 
{

	this.Version = "0.1";
	blah = "bbbb";
	
	this.Modules = new Array();
	
	this.AddModule = function(module)
	{
		this.Modules.push( module );
		
		//alert("a module has beena dded");
	}

	this.ModulesToString = function()
	{
		r = "Modules:";
		
		for( i in this.Modules )
		{
			r += "\r\n"+this.Modules[i].Name+" ("+this.Modules[i].Menu+")";
		}
		
		return r;
	}
	
	this.ModulesToMenu = function()
	{
		r = "";
	}
	

	
	this.Editors = {};
	
	this.Editor = function(editorName)
	{
		return this.Editors[editorName];
	}
	
	
	this.HandleFileSelect = function(evt) 
	{
	

		evt.stopPropagation();
		evt.preventDefault();
		var files = evt.dataTransfer.files; 
		if ( files.length > 1 )
		{	
			alert("You can only drop one image file");
		}
		else
		{
			var file = files[0];
			var reader = new FileReader();  
			reader.onload = function(e) 
			{  
				var canvas = evt.originalTarget;
				//var canvas2 = document.getElementById("cnv2");
				//canvas2.x=300;
				var context = canvas.getContext("2d");
				var imageObj = new Image();
				imageObj.onload = function()
				{
					canvas.width = this.width;
					canvas.height = this.height;
					context.drawImage(this,0, 0);
				}
				imageObj.src = e.target.result;
			}
			reader.readAsDataURL(file); 
		}
	}
	
	
	//function repairCanvasSize()
	//{canvas }
	this.HandleDragOver = function(evt) 
	{
	
		evt.stopPropagation();
		evt.preventDefault();
		evt.dataTransfer.dropEffect = 'copy'; 
	}
	
	return "constructed";
}

function SsspEditor( name, target, config )
{
	this.Name = name;
	this.Target = target;
	this.Config = config;
	

	this.id = function( str )
	{
		return this.Name +"_"+ str;
	}
	
	this.Config.Editors[this.Name] = this;
	
	this.Modules = this.Config.Modules.slice(0);
	this.ActiveModule = null;
	
	
	this.InvokeModule = function( moduleMenu )
	{
		module = null;
		moduleId = -1;
		for( m in editor.Modules )
		{
			if ( editor.Modules[m].Menu == moduleMenu )
			{
				moduleId = m;
				module =  editor.Modules[m];
			}
		}
		
		this.ActiveModule = new module.Use( this, moduleId );
		this.ActiveModule.Invoke();
		
		this.ActiveModule.Apply();
	}
	
	this.endModule = function( keepChanges )
	{
		if ( !keepChanges )
		{
			this.canvasRestore();
		}
		
		this.originalImageData = null;
		
		this.ActiveModule.Destroy();
		this.ActiveModule = null;
	}
	
	this.showToolbox = function( position, contents, width )
	{
		el = document.getElementById( this.id("Toolbox"+position) );
		
		el.style.display = "table-cell";
		el.innerHTML = contents;
	}
	
	this.hideToolbox = function( position )
	{
		el = document.getElementById( this.id("Toolbox"+position) );
		el.style.display = "none";
	}
	
	
	this.getApplyCode = function()
	{
		return 'SsspEditorConfig.Editor(\''+this.Name+'\').ActiveModule.Apply()';
	}
	
	this.getCancelButton = function()
	{
		return '<input type="button" value="Cancel" onclick="SsspEditorConfig.Editor(\''+this.Name+'\').endModule();">';
	}
	
	this.getConfirmButton = function()
	{
		return '<input type="button" value="OK" onclick="SsspEditorConfig.Editor(\''+this.Name+'\').endModule(true);">';
	}
	
	this.originalImageData = null;
	

	
	this.setDisplayedData = function( d )
	{
		this.canvas.width = d.width;
		this.canvas.height = d.height;
		
		ctx = this.canvas.getContext("2d");
		ctx.putImageData( d, 0, 0  );
	}
	this.getOriginalData = function()
	{
		
		
		w = this.originalImageData.width;
		h = this.originalImageData.height;
		canvas = document.createElement('canvas');
		canvas.width = w;
		canvas.height = h;
		context = canvas.getContext('2d');
		context.putImageData(this.originalImageData, 0, 0);
		return context.getImageData(0, 0, w, h);

	}
	
	this.canvasBackup = function()
	{
		ctx = this.canvas.getContext("2d");
		this.originalImageData = ctx.getImageData(0,0,this.canvas.width,this.canvas.height );
		
	}
	
	this.canvasRestore = function()
	{
		this.setDisplayedData( this.originalImageData );
	}
	
	this.MenuHtml = function()
	{
		tree = new Tree( "menu ");
		
		for( i in this.Modules )
		{
		
			split = this.Modules[i].Menu.split(">");
			path = new Array();
			
			for( p in split )
			{
				path.push( { name: split[p], toString: function() { return this.name }, toHtml: function() { return '<a href="#">'+this.name+'</a>'; } } );

			}
			//alert("i="+i);
			this.Modules[i].toHtml = function() { return '<a href="javascript: SsspEditorConfig.Editor(\''+name+'\').InvokeModule( \''+this.Menu+'\'); ">'+this.Name+'</a>'; };
			
			tree.add( path, this.Modules[i] );
		}
	
		return tree.toHtml();
	}
	
	
	cont = $( target );
	
	h = '';
	
	
	h += '<div style="display:inline-block;">';
	h += '    <table border=3 width="100%">';
	h += '    <tr><td id="'+this.id("MenuCell")+'" colspan="3">Menu</td></tr>';
	h += '    <tr><td id="'+this.id("ToolboxTop")+'" style="display:none;" colspan="3"></td></tr>';
	h += '    <tr>';
	h += '        <td id="'+this.id("ToolboxLeft")+'" style="display:none;" valign="top"></td>';
	h += '        <td id="'+this.id("CanvasCell")+'"><canvas id="'+this.id('Canvas')+'" style="border:3px red solid;"></canvas></td>';
	h += '        <td id="'+this.id("ToolboxRight")+'" style="display:none;" valign="top"></td>';
	h += '    </tr>';
	h += '    <tr><td '+this.id("ToolboxBottom")+' style="display:none;" colspan="3"></td></tr>';
	h += '</table></div>';

	
	
	cont.html( h );
	
	
	menu = document.getElementById(this.id('MenuCell'));
	$("#codeOutput").text( this.MenuHtml() );
	menu.innerHTML = '<div id="'+this.id('MenuContainer')+'" class="jqueryslidemenu">'+this.MenuHtml()+'</div>';
	
	jqueryslidemenu.buildmenu(this.id('MenuContainer'), arrowimages)
	
	canv = document.getElementById(this.id('Canvas'));
	canv.width = 300;
	canv.height = 300;
	
	
	var context = canv.getContext("2d");
	context.fillText("Drag-Drop an image here", 85, 140); 

	
	canv.addEventListener('dragover', config.HandleDragOver, false);
	canv.addEventListener('drop', config.HandleFileSelect, false);  
	
	this.canvas = canv;
	
	
	
}

SsspEditorConfig = new SsspEditorConfig();



