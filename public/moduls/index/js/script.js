$(document).ready(function(){
	$('.block-a').click(function(e){
		e.preventDefault();
	});

	$('#head-main-menu li').click(function(){
		$('#head-main-menu li').each(function(){
			$(this).removeClass('active');
		});
		$(this).addClass('active');
	
	});

	$('#searchString').focus(function(){
	
		
	});
	
	var searchflag = true;	
	
	/* back to load page state */
	$('#searchString').change(function(){
		console.log('in chabge' + $(this).val());
	
		if (searchflag == false && $(this).val() == '') {
			console.log('inside');
		}
	
	});
	
	
	
	$('#searchString').keypress(function(event){
		var searchStr = $.trim($('#searchString').val() + event.key);
		if (searchflag && searchStr.length > 0) {
			$('#search-input-block h2').hide('fast');
			$('#search-input-block').css('marginTop','10px');
			$('#searchString').css('width','90%');
			$('#searchString').css('float','right');
			
			$('#car-animation-span').show();
			$('#car-animation-span').removeClass('hidden');
			
			$('#search-block-input').removeClass('col-xs-12');
			$('#search-block-input').addClass('col-xs-11');
			
			searchflag = false;
		}
		if (searchStr != '' && searchStr.length > 2) {
			/*$.ajax({
            url: 'search.php',
            type: 'POST',
            data: {oper: 'search_result', value: searchStr},
            dataType: 'json',
            error: function() {
                console.log('Error');
                
            },
            success: function(r) {
                if (r.status) {
					$('#main-rigth-result').html(r.html);
					$('#main-rigth-result').show();
					$('.search-results').show();
					$('#catalog-menu-left').show();
					
				} else {
					console.log(r.status);
				}
                
            }
			
			
			
        });*/
			$('#main-rigth-result').show();
			$('.search-results').show();
			$('#catalog-menu-left').show();
			
		} 
			
			
		
	});

});