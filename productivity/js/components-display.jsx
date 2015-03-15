var React = require('react');
var _ = require('lodash');

var Table = require('components/table').Table;

var data = [
                 "251935,251935.2,1,3/2/2015 12:00:00,3/2/2015 12:00:00,FEDEX,Arcu Eu Odio Corp.",

                "251970,251970.3,1,3/2/2015 12:00:00,3/2/2015 12:00:00,UPS,Placerat Eget Inc.",
                "251969,251969.2,1,3/2/2015 12:00:00,3/2/2015 12:00:00,ENVCO,Est Nunc Ullamcorper Corporation",
                "251584,251584.23,15,3/2/2015 12:00:00,3/2/2015 12:00:00,LANDB,Libero Morbi Accumsan Company"
        ];
React.render(<Table rows={data}/>, document.body);

