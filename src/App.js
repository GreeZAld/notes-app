import React from 'react';
import { HighlightWithinTextarea } from 'react-highlight-within-textarea';
import Notes from './components/Notes';
import Tags from './components/Tags';
import axios from 'axios';
import './App.scss';

class App2 extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            notes: [],
            newNote: '',
            updatedNote: null,
            tags: [],
            filteredNotes: []
        }
        this.handleChange = this.handleChange.bind(this);
        this.checkTags = this.checkTags.bind(this);
        this.saveButtonHandler = this.saveButtonHandler.bind(this);
        this.updateButtonHandler = this.updateButtonHandler.bind(this);
        this.editButtonHandler = this.editButtonHandler.bind(this);
        this.deleteButtonHandler = this.deleteButtonHandler.bind(this);
        this.filterHandler = this.filterHandler.bind(this);
        this.getData = this.getData.bind(this);
    };

    handleChange = (e) => {
        let newOne = e.target.value;
        this.setState({ newNote: newOne });
    }

    getData = async () => {
        await axios.get('https://my-notes-app-tt.herokuapp.com/notes')
            .then((response) => {
                this.setState({ notes: response.data })

                this.state.notes.forEach(note => {
                    if (note.tags.length > 0) {
                        note.tags.forEach(tag => {
                            this.setState(prevState => {
                                if (!prevState.tags.includes(tag)) {
                                    return {
                                        tags: prevState.tags.concat(tag)
                                    }
                                }
                            })
                        })
                    }
                })
            });
    }

    checkTags = (e) => {
        if (e.keyCode === 32) {
            let words = this.state.newNote.split(' ');
            words.map(word => {
                if (word.startsWith('#') && !this.state.tags.includes(word)) {
                    this.setState(prevState => {
                        return {
                            tags: prevState.tags.concat(word)
                        }
                    })
                }
                return null;
            })
            console.log(this.state.tags);
        }
    }

    saveButtonHandler = async () => {
        await axios.post('https://my-notes-app-tt.herokuapp.com/notes', {
            note: this.state.newNote, tags: this.state.newNote.split(' ').filter(word =>
                word.startsWith('#'))
        });
        let words = this.state.newNote.split(' ');
        words.map(word => {
            if (word.startsWith('#')) {
                this.setState(prevState => {
                    if (!prevState.tags.includes(word)) {
                        return {
                            tags: prevState.tags.concat(word)
                        }
                    }
                })
            }
            return null;
        });
        this.setState({ newNote: '' });
        this.getData();
    }

    updateButtonHandler = async () => {
        await axios.patch(`https://my-notes-app-tt.herokuapp.com/notes/${this.state.updatedNote.id}`, {
            note: this.state.newNote, tags: this.state.newNote.split(' ').filter(word =>
                word.startsWith('#'))
        });
        this.setState({ tags: this.state.tags.filter(tag => tag === this.state.updatedNote.tags.map(i => i))});
        this.setState({ newNote: '', updatedNote: null });
        document.getElementsByClassName('add-button')[0].disabled = !document.getElementsByClassName('add-button')[0].disabled;
        this.getData();
    };

    editButtonHandler = (item) => {
        this.setState({
            newNote: item.note,
            updatedNote: item
        });
        document.getElementsByClassName('add-button')[0].disabled = !document.getElementsByClassName('add-button')[0].disabled;
    };

    deleteButtonHandler = async (item) => {
        await axios.delete(`https://my-notes-app-tt.herokuapp.com/notes/${item.id}`);
        this.setState({ tags: this.state.tags.filter(tag => tag === item.tags.map(i => i))});
        this.getData();
    };

    filterHandler = (tag) => {
        this.setState({
            filteredNotes: this.state.notes.filter(note => {
                return note.tags.includes(tag);
            })
        });
        this.setState(prevState => {
            return { notes: prevState.filteredNotes }
        });
        document.getElementsByClassName('reset-button')[0].disabled = "true";
    }

    filterResetHandler = () => {
        this.getData();
        this.setState({ filteredNotes: [] });
    }

    async componentDidMount() {
        this.getData();
    }

    render() {
        return (
            <div className="main">
                <h1>Notes App</h1>
                <div className="note-textarea-wrapper">
                    <HighlightWithinTextarea
                        className="note-textarea"
                        value={this.state.newNote}
                        highlight={/#\S+/g}
                        onChange={this.handleChange}
                        onKeyDown={this.checkTags}
                        placeholder="Enter your note text here..."
                    />
                </div>
                <div className="note-actions-wrapper">
                    <button className="add-button" onClick={this.saveButtonHandler}>Save note</button>
                    <button className="update-button" onClick={this.updateButtonHandler} disabled={this.state.updatedNote ? false : true}>Update note</button>
                </div>
                <Tags
                    tags={this.state.tags}
                    data={this.state.notes}
                    handleFilter={this.filterHandler}
                    handleReset={this.filterResetHandler}
                    filteredNotes={this.state.filteredNotes}
                />
                <Notes
                    notes={this.state.notes}
                    handleDelete={this.deleteButtonHandler}
                    handleEdit={this.editButtonHandler}
                />
            </div>
        )
    }
}

export default App2;
