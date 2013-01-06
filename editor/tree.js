function Tree( initialValue )
{
	this.val = initialValue;
	this.sub = null;
	

	
	this.add = function( path, object )
	{
		
		if ( path.length == 0 )
		{
			//alert("adding final element "+object);
			this.val = object;
		}
		else
		{
			
			if ( this.sub === null  )
				this.sub = new Array();	
			
			
			if ( !this.sub.hasOwnProperty( path[0] ) )
				this.sub[ path[0] ] = new Tree( path[0] );
			
			this.sub[ path[0] ].add( path.slice(1), object );
		
		}
		
		
		
	}
	
	this.toString = function( indent )
	{
		return this.val;
	}
	
	this.toHtml = function()
	{
		return this.toHtmlRecurse( 0 );
	}
	
	this.toHtmlRecurse = function( indent )
	{
		if ( indent > 50 )
		return "!Overflow!";
		
		//alert("tostr indent="+indent+" this="+this.val);
		

		r = "";
		
		if ( indent > 0 )
		{
		
		
			if ( this.sub === null )
				r += this.makeIndent(indent)+"<li>"+this.val.toHtml()+"";
				
			else
				r += this.makeIndent(indent)+"<li>"+this.val.toHtml()+"";
		}
		
		numsub = 0;
		if ( this.sub != null )
		{
			r+= "\r\n"+this.makeIndent(indent)+"<ul>\r\n";
			for( s in this.sub )
			{
				//alert("["+this.val+"] contains a sub ["+s+"] which is "+this.sub[s]);
				r+= this.makeIndent(indent)+this.sub[s].toHtmlRecurse( indent+1 );
				
				numsub++;
				//r+= this.sub[s].toStringRecurse( indent + 4 );
			}
			
			r+= this.makeIndent(indent)+"</ul>\r\n";
		}
		
		if ( indent > 0 )
		{
			r+= (numsub!=0 ? "\r\n" : "" ) +"</li>\r\n";
		}
		
		
		return r;
	}
	
	this.makeIndent = function( indent )
	{
		indentStr = "";
		for( i = 0; i < indent*4; i++ )
		{
			indentStr += " ";
		}
		
		return indentStr;
	}
	

	
	
}