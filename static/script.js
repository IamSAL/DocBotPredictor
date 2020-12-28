$(function(){
    $('input[type=radio]').click(function(){
        var $radio = $(this);
       
        // if this was previously checked
        if ($radio.data('waschecked') == true)
        {
            $radio.prop('checked', false);
            $radio.data('waschecked', false);
        }
        else
            $radio.data('waschecked', true);
        
        // remove was checked from other radios
        $radio.siblings('input[name="rad"]').data('waschecked', false);
    });
});

let radios=document.querySelectorAll('input[type=radio]')
radios.forEach(radio=>{
    radio.addEventListener('click',radiosHandler)
})

function radiosHandler(e){
    if(e.target.getAttribute("value")=="1"){
        e.target.setAttribute("value","0")
    }else{
        e.target.setAttribute("value","1")
    }

}

let paramForm=document.getElementById('eyeParams')
paramForm.addEventListener('submit',handleParams);

let params=["clouldy__blurry_or_foggy_vision", "pressure_in_eye", "injury_to_the_eye", "excessive_dryness", "red_eye", "cornea_increase_in_size", "color_identifying_problem", "double_vision", "have_eye_problem_in_family", "age40", "diabetics", "myopia", "trouble_with_glasses", "hard_to_see_at_night", "visible_whiteness", "mass_pain", "vomiting", "water_drops_from_eyes_continuously", "presents_of_light_when_eye_lid_close"]

let resolvedDisease=document.querySelector('.disease');
let loader=document.querySelector('.overlay');
function handleParams(e){
    loader.style.display="block";
    let collectedParams={}
    for(let param of params){
        try{
            if(e.target[param].value!=undefined){
                collectedParams[param]=e.target[param].value;
                if(param=="age40"){
                    let binary=collectedParams[param]>40?"1":"0";
                    collectedParams[param]=binary;
                    e.target[param].value=binary;
                }
             }else{
                e.target[param].value=0;
             }
        }catch(err){
            console.log(err.message)
            console.log(param)
        }
        
    }
    //console.log(JSON.stringify(collectedParams));
    
    e.preventDefault();

    postData('http://127.0.0.1:4200/api/predict', collectedParams)
  .then(data => {
    resolvedDisease.innerHTML=data.Disease;
    console.log(data.Disease)
    paramForm.reset();
    setTimeout(()=>{
        loader.style.display="none";
    },500)
    
  });
    // e.target.submit();
}

async function postData(url = '', data = {}) {
    // Default options are marked with *
    const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify(data)
      })
    return response.json(); // parses JSON response into native JavaScript objects
  }

 
