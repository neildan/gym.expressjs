const { User, Site, City } = require('./db')

Site.hasMany(User);
User.belongsTo(Site);

City.hasMany(Site);
Site.belongsTo(City);