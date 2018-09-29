import React, { Component } from 'react';
import {
    gql,
    graphql,
    compose,
    Mutation
} from 'react-apollo';

import _ from 'underscore';
import update from 'react-addons-update';

class ChannelsList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: "",
            nameValue: "",
        }
        this.handleKeyUp = this.handleKeyUp.bind(this);
        this.onChangeFunc = this.onChangeFunc.bind(this);
        this.onEditClick = this.onEditClick.bind(this);
        this.onDeleteClick = this.onDeleteClick.bind(this);
    }
    componentWillMount() {
        this.props.data.subscribeToMore({
            document: channelSubscription,  // Use the subscription
            updateQuery: (prev, { subscriptionData }) => {
                if (!subscriptionData.data) {
                    return prev;
                }

                const newChannel = subscriptionData.data.channelAdded;
                // Add check to prevent double adding of channels.
                if (!prev.channels.find((channel) => channel.name === newChannel.name)) {
                    let updatedChannels = Object.assign({}, prev, { channels: [...prev.channels, newChannel] });
                    return updatedChannels;
                } else {
                    return prev;
                }
            }
        });
        this.props.data.subscribeToMore({
            document: deleteChannelSubscription,  // Use the subscription
            updateQuery: (prev, { subscriptionData }) => {
                if (!subscriptionData.data) {
                    return prev;
                }
                const newChannel = subscriptionData.data.channelDeleted;
                const deleteIndex = _.findIndex(prev.channels, (item) => item.id === newChannel.id);
                if (deleteIndex < 0) {
                    return prev;
                }
                return update(prev, {
                    channels: {
                        $splice: [[deleteIndex, 1]]
                    }
                });
            }
        });
        this.props.data.subscribeToMore({
            document: updateChannelSubscription,  // Use the subscription
            updateQuery: (prev, { subscriptionData }) => {
                if (!subscriptionData.data) {
                    return prev;
                }
            }
        });
    }
    handleKeyUp(evt) {
        if (evt.keyCode === 13) {
            evt.persist();
            if (this.state.id !== "") {
                this.props.updateChannelMutation({
                    variables: {
                        name: evt.target.value,
                        id: this.state.id
                    },
                }).then((data) => {
                    evt.target.value = '';
                });
                this.setState({
                    id: ""
                })
            } else {
                this.props.createChannelMutation({
                    variables: {
                        name: evt.target.value
                    },
                }).then((data) => {
                    evt.target.value = '';
                });
            }
        };
    }
    onChangeFunc(event) {
        this.setState({
            nameValue: event.target.value
        })
    }
    onEditClick(ch) {
        this.setState({
            nameValue: ch.name,
            id: ch.id
        });
    }
    onDeleteClick(ch) {
        this.props.deleteChannelMutation({
            variables: {
                id: ch.id
            },
        }).then((data) => {
            console.log("delete Done");
        });
    }
    render() {
        const { data: { loading, error, channels }, match } = this.props;

        if (loading) {
            return <p>Loading ...</p>;
        }
        if (error) {
            return <p>{error.message}</p>;
        }

        return (
            // <ul className="list-group">
            //     {channels.map(ch => <li className="list-group-item" key={ch.id}>{ch.name}</li>)}
            // </ul>
            <div className="container">
                <div className="row justify-content-md-center">
                    <div className="col-md-8">
                        <center><h3 className="main-title">Channel List</h3></center>
                        <hr />
                        <div className="input-group mb-3">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Enter Channel"
                                onKeyUp={this.handleKeyUp}
                                value={this.state.nameValue}
                                onChange={this.onChangeFunc} />
                        </div>
                        <ul className="list-group">
                            {channels.map(ch =>
                                <li key={"div_" + ch.id} className="list-group-item">
                                    <label htmlFor="checkbox5">
                                        {ch.id} : {ch.name}
                                    </label>
                                    <div className="pull-right action-buttons">
                                        <a onClick={() => this.onEditClick(ch)} href="javascript:void(0)"><span className="fa fa-pencil"></span></a>
                                        <a onClick={() => this.onDeleteClick(ch)} href="javascript:void(0)"><span className="fa fa-trash"></span></a>
                                        {/* <Mutation mutation={deleteChannel} >
                                            {(deleteChannelMutation, { data }) => (
                                                <a className="trash" href="javascript:void(0)" onClick={() => { deleteChannelMutation({ variables: { id: ch.id } }); }}><span className="fa fa-trash"></span></a>

                                            )}
                                        </Mutation> */}
                                    </div>
                                </li>
                            )}
                        </ul>
                    </div>
                </div>
            </div>
        );
    }
}

export const channelsListQuery = gql`
   query ChannelsListQuery {
     channels {
       id
       name
     }
   }
 `;

const channelSubscription = gql`
    subscription Channels {
     channelAdded {
       id
       name
     }
    }
`
const deleteChannelSubscription = gql`
    subscription Channels {
    channelDeleted {
       id
       name
     }
    }
`
const updateChannelSubscription = gql`
    subscription Channels {
    channelUpdated {
       id
       name
     }
    }
`

const CreateChannelMutation = gql`
  mutation addChannel($name: String!) {
    addChannel(name: $name) {
      id
      name
    }
  }
`;

const updateChannel = gql`
  mutation updateChannelMutation($id: Int!,$name:String!) {
    updateChannel(id: $id,name:$name) {
      id
      name
    }
  }
`;

const deleteChannel = gql`
  mutation deleteChannelMutation($id: Int!) {
    deleteChannel(id: $id) {
      id
      name
    }
  }
`;

const multipleMutation = compose(
    graphql(CreateChannelMutation, { name: 'createChannelMutation' }),
    graphql(updateChannel, { name: 'updateChannelMutation' }),
    graphql(deleteChannel, { name: 'deleteChannelMutation' })
)

export default compose(multipleMutation, graphql(channelsListQuery))(ChannelsList);



// const ChannelsListWithData = graphql(channelsListQuery)(ChannelsList);
// export default ChannelsListWithData;
