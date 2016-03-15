const defaultAggregation = {
  name: 'count',
  label: "Count"
};

function remainingGroups(groups, rowNames, columnNames) {
  return groups.filter((g) => {
    return !(rowNames.includes(g.name) || columnNames.includes(g.name));
  });
}

function selectedGroups(groups, groupValues, names) {
  return groups.filter((g) => {
    return names.includes(g.name);
  }).map((g) => {
    g.values = groupValues[g.name] || [];
    return g;
  });
}

export default function Pivot(props) {
    const {availableGroups = [], groupValues = {}, rowGroups = [], columnGroups = [], aggregation = defaultAggregation} = props;
    const {groupControls} = props;
    return (
        <div>
          <div>{aggregation.label}</div>
          <Groups className="remaining" list={remainingGroups(availableGroups, rowGroups, columnGroups)} />
          <SelectedGroups className="row" {...{groupControls}} list={selectedGroups(availableGroups, groupValues, rowGroups)} />
          <SelectedGroups className="column" {...{groupControls}} list={selectedGroups(availableGroups, groupValues, columnGroups)} />
        </div>
    );
}

function Groups({className, list}) {
  return (
    <div className={className}>
      {list.map((g) => {
        return <Group key={g.name} {...g} />;
      })}
    </div>);
}

function SelectedGroups({className, list, groupControls}) {
  const controls = groupControls;
  return (
    <div className={className}>
      {list.map((g) => {
        return (
          <Group key={g.name} {...g}>
            <SelectableValues {...g} {...{controls}}/>
          </Group>);
      })}
    </div>);
}

function Group({name, label, children}) {
  return (
    <div data-name={name}>
      <div>{label}</div>
        {children}
    </div>);
}

function GroupControls({change, remove}) {
  return (<div><button onClick={remove}>X</button><button onClick={change}>&gt;&lt;</button></div>);
}

function SelectableValues({values, controls}) {
  return  (
    <div>
      <GroupControls {...{controls}} />
      <ul>
        {values && values.map(({name, selected}) => {
          return <li key={name}><input type="checkbox" name={name} value={name} checked={selected} /><label for={name}>{name}</label></li>;
        })}
      </ul>
    </div>);
}
