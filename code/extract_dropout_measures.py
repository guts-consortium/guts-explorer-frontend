from pathlib import Path
import json
import numpy as np
import pandas as pd
import sys
# import plotly.graph_objects as go
# import plotly.colors as pc



def get_participation_counts(cohort, filename, col_elements):
    """"""
    # read file
    spss = pd.read_spss(filename)
    # Get columns as list
    cols = list(spss.columns)
    # Isolate visit columns ("Yes/No"); and FamilyID
    visit_cols = []
    for i in range(len(col_elements)):
        visit_cols.append(cols[col_elements[i]])

    data = []
    for i in range(len(col_elements)-1):
        if i == 0:
            pass
        else:
            visits = spss[visit_cols[i+1]].to_list()
            new_dat = ['No' if k != 'Yes' else 'Yes' for k in visits]
            data.append(new_dat)

    dataf = spss[visit_cols]
    stack = dataf.stack()
    stack[ stack != 'Yes'] = 'No'
    dataf2 = stack.unstack()
    dataf2 = dataf2.drop(columns=['FamilyID'])

    # 
    visits = dataf2.columns.to_list()

    # source, target, value
    source = []
    target = []
    value = []
    label = []
    attendance = []
    link_color = []
    n = 0
    for i, v in enumerate(visits):
        if i == len(visits)-1:
            label.append('V' + visits[i][3])
            attendance.append('attended Visit ' + visits[i][3])
            label.append('V' + visits[i][3])
            attendance.append('could not attend Visit ' + visits[i][3])
            break
        # current visit
        # n
        kaas = dataf2[v].value_counts()
        r_yes = dataf2.loc[dataf2[v]  == 'Yes']
        r_yes_count = r_yes[v].size
        # n + 2
        r_yes_to_yes = r_yes.loc[r_yes[visits[i+1]]  == 'Yes']
        r_yes_to_yes_count = r_yes_to_yes[visits[i+1]].size
        # n + 3
        r_yes_to_no = r_yes.loc[r_yes[visits[i+1]]  == 'No']
        r_yes_to_no_count = r_yes_to_no[visits[i+1]].size

        # n + 1
        r_no = dataf2.loc[dataf2[v]  == 'No']
        r_no_count = r_no[v].size
        # n + 2
        r_no_to_yes = r_no.loc[r_no[visits[i+1]]  == 'Yes']
        r_no_to_yes_count = r_no_to_yes[visits[i+1]].size
        # n + 3
        r_no_to_no = r_no.loc[r_no[visits[i+1]]  == 'No']
        r_no_to_no_count = r_no_to_no[visits[i+1]].size
        
        # Yes to yes
        source.append(n)
        target.append(n+2)
        value.append(r_yes_to_yes_count)
        link_color.append("yes_color")
        # Yes to no
        source.append(n)
        target.append(n+3)
        value.append(r_yes_to_no_count)
        link_color.append("no_color")
        # no to yes
        source.append(n+1)
        target.append(n+2)
        value.append(r_no_to_yes_count)
        link_color.append("yes_color")
        # no to no
        source.append(n+1)
        target.append(n+3)
        value.append(r_no_to_no_count)
        link_color.append("no_color")
        
        label.append('V' + visits[i][3])
        attendance.append('attended Visit ' + visits[i][3])
        label.append('V' + visits[i][3])
        attendance.append('could not attend Visit ' + visits[i][3])
        
        n = n+2
    
    return {
        "source": source,
        "target": target,
        "value": value,
        "label": label,
        "attendance": attendance,
        "link_color": link_color,
    }

# Read spss file into a pandas dataframe
# spss_fn = Path(sys.argv[1])
spss_fns = [Path(sys.argv[1]), Path(sys.argv[2])]
cohorts = ['ecc', 'mcc']
columns = [[0,7,11,15,19,23,27], [0,7,12,17,22,27,32]]
out_data = {
    "ecc": None,
    "mcc": None
}
# get out_data
for i, fn in enumerate(spss_fns):
    out_data[cohorts[i]] = get_participation_counts(cohorts[i], fn, columns[i])

# Lastly Write out_data to file
package_path = Path(__file__).resolve().parent.parent
out_dir = package_path / 'inputs' / 'processed_data'
out_dir.mkdir(parents=True, exist_ok=True)
out_file = out_dir / 'participation_data.json'
with open(out_file, 'w') as f:
    json.dump(out_data, f)



opacity = 0.25
link_color_rgba = [f"rgba{str(pc.hex_to_rgb(cl))[:-1]}, {opacity})" for cl in link_color]
link_color_rgb = [f"rgb{str(pc.hex_to_rgb(cl))}" for cl in link_color]


bar_thickness = 40
pad_thickness = 15
bar_color = steel_blue

fig = go.Figure(data=[go.Sankey(
    node = dict(
      pad = pad_thickness,
      thickness = bar_thickness,
      line = dict(color = "black", width = 0.5),
      label = label,
      customdata = attendance,
      hovertemplate='N=%{value:.0f} participants %{customdata}<extra></extra>',
      color = bar_color
    ),
    link = dict(
      source = source,
      target = target,
      value = value,
      color = link_color_rgba,
      hovertemplate='Of the %{source.value} participants <br />that %{source.customdata},<br />' +
        '%{value:.0f} %{target.customdata}<extra></extra>',
  ))])

fig.update_layout(title_text="ECC participant dropout and recovery (N_total=238)", font_size=10,
                 paper_bgcolor='rgba(0,0,0,0)',
            plot_bgcolor='rgba(0,0,0,0)')
fontt = dict(
            family="Courier New, monospace",
            size=16,
            color="#ffffff"
            )
y_below = -0.15
annotation_text = ["Visit (1-6)", "Attended", "Did not attend", "N=238<br>(100%)", "N=177<br>(74.4%)"]
annotation_position = [[0.2, y_below], [0.48, y_below], [0.8, y_below], [-0.09, 0.5], [1.1, 0.5]]
annotation_color = [bar_color, "yes_color", "no_color", bar_color, bar_color]
annotation_opacity = [0.9, 0.4, 0.4, 0.6, 0.6]

for i,t in enumerate(annotation_text):
    fig.add_annotation(
            x=annotation_position[i][0],
            y=annotation_position[i][1],
            xref="paper",
            yref="paper",
            text=annotation_text[i],
            showarrow=False,
            font=fontt,
            align="center",
            bgcolor=annotation_color[i],
            opacity=annotation_opacity[i],
            bordercolor=annotation_color[i],
            borderwidth=2,
            borderpad=4,
            )
# fig.show()