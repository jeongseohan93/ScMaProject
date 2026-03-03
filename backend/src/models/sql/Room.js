module.exports = (sequelize, DataTypes) => {
    if (!DataTypes) {
        throw new Error("DataTypes is undefined. Check your models/index.js!");
    }

    const Room = sequelize.define('Room', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,      
            autoIncrement: true,   
            allowNull: false
        },
        type: {
            type: DataTypes.ENUM('DIRECT', 'GROUP'),
            defaultValue: 'DIRECT'
        },
        lastMessage: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    },{
        tableName: 'Rooms',
        timestamps: true // updatedAt이 곧 '채팅방이 위로 끌어올려진 시간'이 됨
    });

    Room.associate = (models) => {
        Room.hasMany(models.Chat,{ foreignKey: 'roomId', sourceKey: 'id' })
    }

    return Room;
}