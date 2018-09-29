import { PubSub } from 'graphql-subscriptions';
var mysql = require('mysql')
var connection = mysql.createConnection({
  host: '192.168.0.77',
  user: 'gqlgenreact',
  password: 'gqlgenreact',
  database: 'gqlgenreact'
});

const channels = [{
  id: 1,
  name: 'soccer',
}, {
  id: 2,
  name: 'baseball',
}];

let nextId = 3;
const CHANNEL_ADDED_TOPIC = 'newChannel';
const CHANNEL_UPDATE_TOPIC = 'updateChannel';
const CHANNEL_DELETE_TOPIC = 'deleteChannel';
const pubsub = new PubSub();

export const resolvers = {
  Query: {
    channels: () => {
      return new Promise((resolve, reject) => {
        connection.query('SELECT * from channel', function (err, rows, fields) {
          if (err) throw err
          resolve(rows)
        })
      });
    }
  },
  Mutation: {
    addChannel: (root, args) => {
      return new Promise((resolve, reject) => {
        connection.query('INSERT INTO channel (name) VALUES (?)', [args.name], function (err, rows) {
          if (err) throw err
          const newChannel = { name: args.name, id: rows.insertId };
          console.log("newChannel :", newChannel);
          pubsub.publish(CHANNEL_ADDED_TOPIC, { channelAdded: newChannel });
          resolve(newChannel)
        })
      });
    }, updateChannel: (root, args) => {
      return new Promise((resolve, reject) => {
        connection.query('UPDATE channel SET name=? WHERE id=?', [args.name, args.id], function (err, rows) {
          if (err) throw err
          const newChannel = { name: args.name, id: args.id };
          pubsub.publish(CHANNEL_UPDATE_TOPIC, { channelUpdated: newChannel });
          resolve(newChannel)
        })
      });

    }, deleteChannel: (root, args) => {
      return new Promise((resolve, reject) => {
        connection.query('DELETE FROM channel WHERE id=?', [args.id], function (err, rows) {
          if (err) throw err
          const newChannel = { name: "", id: args.id };
          pubsub.publish(CHANNEL_DELETE_TOPIC, { channelDeleted: newChannel });
          resolve(newChannel)
        })
      });

    }
  },
  Subscription: {
    channelAdded: {
      subscribe: () => pubsub.asyncIterator(CHANNEL_ADDED_TOPIC)
    },
    channelUpdated: {
      subscribe: () => pubsub.asyncIterator(CHANNEL_UPDATE_TOPIC)
    },
    channelDeleted: {
      subscribe: () => pubsub.asyncIterator(CHANNEL_DELETE_TOPIC)
    }
  }
};
