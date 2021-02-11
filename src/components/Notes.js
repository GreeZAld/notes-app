import React from 'react';

function Notes(props) {


    return (
            <div>

                <div className="notes-container">
                    {Array.from(props.notes).map(item => {
                        return (
                            <div className="note">
                                <div className="note-text">{item.note.split(' ').map(word => {
                                    if (word.startsWith('#')) {
                                        return <span className="marked">{word} </span>
                                    }
                                    else {
                                        return word + ' ';
                                    }
                                })}</div>
                                <div className="controls">
                                    <span className="edit-icon" onClick={() => props.handleEdit(item)}></span>
                                    <span className="delete-icon" onClick={() => props.handleDelete(item)}></span>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        )
    }

export default Notes;
