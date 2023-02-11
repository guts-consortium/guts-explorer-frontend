/*********/
// Paths //
/*********/

const template_dir = "./templates";
const data_dir = "./inputs/processed_data";


/*********/
// Flags //
/*********/

const include_wave_7 = true;


/********/
// Data //
/********/

var cohorts = {
    ecc: "Early Childhood Cohort",
    mcc: "Middle Childhood Cohort",
}
var cats = [
    {
        name: "Social competence",
        display_name: "Social",
        short_name: "social-competence",
        description: "The ability to adapt flexibly to demands in the social environment.",
        icon: "far fa-comments"
    },
    {
        name: "Parenting",
        display_name: "Parenting",
        short_name: "parenting",
        description: "The specific, goal-directed behaviors that parents use to guide their children.",
        icon: "fas fa-user-group"
    },
    {
        name: "Neurobiological & physiological measures",
        display_name: "Neurobiological",
        short_name: "neurobiological-and-physiological-measures",
        description: "Structural and functional neuroimaging measures, and physiological measures related to growth, sleep and heritability.",
        icon: "fas fa-brain"

    },
    {
        name: "Family background measures",
        display_name: "Family",
        short_name: "family-background-measures",
        description: "Family characteristics, live events, and pregnancy and birth.",
        icon: "fas fa-users"
    },
    {
        name: "Environmental factors",
        display_name: "Environmental",
        short_name: "environmental-factors",
        description: "All factors related to the household and language environment.",
        icon: "fas fa-house"
    },
    {
        name: "Susceptibility markers",
        display_name: "Susceptibility",
        short_name: "differential-susceptibility-markers",
        description: "Including child as well as parent informed measures on temperament of the child.",
        icon: "far fa-face-sad-tear"
    },
    {
        name: "Behavioral control",
        display_name: "Behavioral",
        short_name: "behavioral-control",
        description: "Regulating one's behavior in response to stimuli.",
        icon: "fas fa-scale-unbalanced-flip"
    },
    {
        name: "Additional markers",
        display_name: "Additional",
        short_name: "additional-measures",
        description: "Any additional measures not belonging to other categories",
        icon: "fas fa-plus"
    }
]
var categories_list = cats.map(function(category) {
    return category["short_name"];
});
categories_list = categories_list.sort()
var categories_display = cats.reduce((output, curr) => {
  output[curr.short_name] = curr.display_name;
  return output;
}, {});
var display_details_names = {
    cohort: 'Cohort',
    session: 'Session',
    measure_category: 'Measure Category',
    measure_name: 'Measure Name',
    respondents: 'Respondents',
    description: 'Description',
    references: 'References',
}
var lcid_colors = ["#242A33","#505F73","#283D3B","#197278","#D6BCB4","#AB5B24","#DE752F","#C44536","#772E25","#EDDDD4"]


/*************/
// Functions //
/*************/

async function checkFileExists(url) {
  try {
    const response = await fetch(url, {
      method: "HEAD",
      cache: "no-cache",
    });
    return response.status === 200;
  } catch (error) {
    return false;
  }
}

function downloadObjectAsJson(obj, filename){
  var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(obj));
  var downloadAnchorNode = document.createElement('a');
  downloadAnchorNode.setAttribute("href",     dataStr);
  downloadAnchorNode.setAttribute("download", filename + ".json");
  document.body.appendChild(downloadAnchorNode);
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
}

function makeReadable(input) {
  // capitalize first letter
  var output = input.charAt(0).toUpperCase() + input.slice(1)
  // Replace underscores and dashes with space
  output = output.replace(/_/g,' ');
  output = output.replace(/-/g,' ');
  return output
}

function addAlphaToHex(hexcode, opacity) {
  var _opacity = Math.round(Math.min(Math.max(opacity || 1, 0), 1) * 255);
  return hexcode + _opacity.toString(16).toUpperCase();
}