import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import "./style.css";

export const Calendar = (props) => {
  const [events, setEvents] = useState([]);
  const [currentView, setCurrentView] = useState("dayGridWeek");
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: "", date: "", startTime: "", endTime: "" });
  const [scheduleCourses, setScheduleCourses] = useState([{
    courseName: "",
    creditHours: "",
    startTime: "",
    endTime: "",
    days: { M: false, T: false, W: false, TR: false, F: false },
  }]);
  const [semesterStartDate, setSemesterStartDate] = useState("");
  const [semesterEndDate, setSemesterEndDate] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editingEventId, setEditingEventId] = useState(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  useEffect(() => {
    fetch("/api/events", { credentials: "include" })
      .then((res) => (res.status === 204 ? [] : res.json()))
      .then((data) =>
        data.map((event) => ({
          id: event.event_id,
          title: event.event_name,
          start: `${new Date(event.date).toISOString().split("T")[0]}T${event.start_time}`,
          end: `${new Date(event.date).toISOString().split("T")[0]}T${event.end_time}`,
        }))
      )
      .catch((error) => console.error("Error fetching events:", error));
  }, []);

  const handleDateClick = (arg) => {
    if (currentView === "dayGridMonth") {
      const title = prompt("Enter event title:");
      if (title) {
        setEvents([...events, { title, date: arg.dateStr }]);
      }
    }
  };

  const handleAddEvent = () => {
    setIsEventModalOpen(true);
  };

  const handleAddSchedule = () => {
    setIsScheduleModalOpen(true);
  };

  const handleSaveEvent = async (e) => {
    e.preventDefault();
    if (newEvent.title && newEvent.date && newEvent.startTime && newEvent.endTime) {
      try {
        const res = await fetch("/api/events", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            event_name: newEvent.title,
            event_type: "Other",
            date: newEvent.date,
            start_time: newEvent.startTime,
            end_time: newEvent.endTime,
            location: "TBD",
          }),
        });
        if (!res.ok) throw new Error("Failed to save event");
        const savedEvent = await res.json();
        setEvents([...events, {
          id: savedEvent.event_id,
          title: savedEvent.event_name,
          start: `${savedEvent.date}T${savedEvent.startTime}`,
          end: `${savedEvent.date}T${savedEvent.endTime}`,
        }]);
        handleCloseEventModal();
      } catch (error) {
        console.error("Failed to save event:", error);
        alert("Failed to save event.");
      }
    }
  };

  const handleUpdateEvent = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/events/${editingEventId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          event_name: newEvent.title,
          event_type: "Other",
          date: newEvent.date,
          start_time: newEvent.startTime,
          end_time: newEvent.endTime,
          location: "TBD",
        }),
      });
      if (!res.ok) throw new Error("Failed to update event");
      setEvents((prev) =>
        prev.map((event) =>
          event.id === editingEventId
            ? {
                ...event,
                title: newEvent.title,
                start: `${newEvent.date}T${newEvent.startTime}`,
                end: `${newEvent.date}T${newEvent.endTime}`,
              }
            : event
        )
      );
      handleCloseEventModal();
    } catch (error) {
      console.error("Error updating event:", error);
      alert("Failed to update event.");
    }
  };

  const handleDeleteEvent = async () => {
    try {
      const res = await fetch(`/api/events/${editingEventId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to delete event");
      setEvents((prev) => prev.filter((e) => e.id !== editingEventId));
      setIsConfirmOpen(false);
      handleCloseEventModal();
    } catch (error) {
      console.error("Error deleting event:", error);
      alert("Failed to delete event.");
    }
  };

  const handleCloseEventModal = () => {
    setIsEventModalOpen(false);
    setNewEvent({ title: "", date: "", startTime: "", endTime: "" });
    setIsEditing(false);
    setEditingEventId(null);
  };

  const handleCloseScheduleModal = () => {
    setIsScheduleModalOpen(false);
    setScheduleCourses([{
      courseName: "",
      creditHours: "",
      startTime: "",
      endTime: "",
      days: { M: false, T: false, W: false, TR: false, F: false },
    }]);
  };

  const handleScheduleInputChange = (index, event) => {
    const { name, value } = event.target;
    const newCourses = [...scheduleCourses];
    newCourses[index][name] = value;
    setScheduleCourses(newCourses);
  };

  const handleScheduleCheckboxChange = (index, day) => {
    const newCourses = [...scheduleCourses];
    newCourses[index].days[day] = !newCourses[index].days[day];
    setScheduleCourses(newCourses);
  };

  const addCourse = () => {
    setScheduleCourses([...scheduleCourses, {
      courseName: "",
      creditHours: "",
      startTime: "",
      endTime: "",
      days: { M: false, T: false, W: false, TR: false, F: false },
    }]);
  };

  const handleSaveSchedule = (e) => {
    e.preventDefault();
    console.log("Saving schedule:", scheduleCourses);
    handleCloseScheduleModal();
    // API call for saving schedule will go here later
  };

  return (
    <div className="calendar-container">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView={currentView}
        height={600}
        headerToolbar={{
          left: "prev,next addEventButton addScheduleButton",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        customButtons={{
          addEventButton: {
            text: "Add Event",
            click: handleAddEvent,
          },
          addScheduleButton: {
            text: "Add Schedule",
            click: handleAddSchedule,
          },
        }}
        buttonText={{
          today: "Today",
          month: "Month",
          week: "Week",
          day: "Day",
        }}
        allDaySlot={false}
        slotDuration="01:00:00"
        slotLabelInterval="01:00:00"
        slotLabelFormat={{ hour: "numeric", minute: "2-digit", omitZeroMinute: true, meridiem: "short" }}
        events={events}
        dateClick={handleDateClick}
        eventClick={(info) => {
          const clickedEvent = events.find((e) => String(e.id) === String(info.event.id));
          const start = info.event.startStr.split("T");
          const end = info.event.endStr?.split("T") ?? start;

          setNewEvent({
            title: clickedEvent.title,
            date: start[0],
            startTime: start[1].slice(0, 5),
            endTime: end[1]?.slice(0, 5) ?? start[1].slice(0, 5),
          });

          setEditingEventId(clickedEvent.id);
          setIsEditing(true);
          setIsEventModalOpen(true);
        }}
        viewDidMount={(view) => {
          setCurrentView(view.view.type);
        }}
      />

      {/* EventAdder Modal */}
      {isEventModalOpen && (
        <div className="modal-overlay">
          <div className="EventAdder">
            <h2>{isEditing ? "Edit Event" : "Add New Event"}</h2>
            <form onSubmit={isEditing ? handleUpdateEvent : handleSaveEvent}>
              <div className="form-group">
                <label>Title:</label>
                <input
                  type="text"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Date:</label>
                <input
                  type="date"
                  value={newEvent.date}
                  onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Start Time:</label>
                <input
                  type="time"
                  value={newEvent.startTime}
                  onChange={(e) => setNewEvent({ ...newEvent, startTime: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>End Time:</label>
                <input
                  type="time"
                  value={newEvent.endTime}
                  onChange={(e) => setNewEvent({ ...newEvent, endTime: e.target.value })}
                  required
                />
              </div>
              <div className="modal-actions">
                <button type="button" onClick={handleCloseEventModal}>
                  Cancel
                </button>
                {isEditing && (
                  <button type="button" onClick={() => setIsConfirmOpen(true)}>
                    Delete
                  </button>
                )}
                <button type="submit">{isEditing ? "Save Changes" : "Save"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Delete Modal */}
      {isConfirmOpen && (
        <div className="modal-overlay">
          <div className="EventAdder">
            <h2>Confirm Delete</h2>
            <p>Are you sure you want to delete this event?</p>
            <div className="modal-actions">
              <button onClick={() => setIsConfirmOpen(false)}>Cancel</button>
              <button onClick={handleDeleteEvent}>
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Schedule Modal */}
      {isScheduleModalOpen && (
        <div className="modal-overlay">
          <div className="AddScheduleModal">
            <h2>Add Schedule</h2>
            <form onSubmit={handleSaveSchedule}>
              <div className="form-group">
                <label>Semester Start Date:</label>
                <input
                  type="date"
                  value={semesterStartDate}
                  onChange={(e) => setSemesterStartDate(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Semester End Date:</label>
                <input
                  type="date"
                  value={semesterEndDate}
                  onChange={(e) => setSemesterEndDate(e.target.value)}
                  required
                />
              </div>
              {scheduleCourses.map((course, index) => (
                <div key={index} className="course-form">
                  <h3>Course {index + 1}</h3>
                  <div className="form-group">
                    <label>Course Name:</label>
                    <input
                      type="text"
                      name="courseName"
                      value={course.courseName}
                      onChange={(event) => handleScheduleInputChange(index, event)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Credit Hours:</label>
                    <input
                      type="number"
                      name="creditHours"
                      value={course.creditHours}
                      onChange={(event) => handleScheduleInputChange(index, event)}
                      min="1"
                      max="18"
                    />
                  </div>
                  <div className="form-group">
                    <label>Start Time:</label>
                    <input
                      type="time"
                      name="startTime"
                      value={course.startTime}
                      onChange={(event) => handleScheduleInputChange(index, event)}
                    />
                  </div>
                  <div className="form-group">
                    <label>End Time:</label>
                    <input
                      type="time"
                      name="endTime"
                      value={course.endTime}
                      onChange={(event) => handleScheduleInputChange(index, event)}
                    />
                  </div>
                  <div className="form-group days-checkboxes">
                    <label>Days:</label>
                    <label>
                      <input
                        type="checkbox"
                        checked={course.days.M}
                        onChange={() => handleScheduleCheckboxChange(index, "M")}
                      />
                      M
                    </label>
                    <label>
                      <input
                        type="checkbox"
                        checked={course.days.T}
                        onChange={() => handleScheduleCheckboxChange(index, "T")}
                      />
                      T
                    </label>
                    <label>
                      <input
                        type="checkbox"
                        checked={course.days.W}
                        onChange={() => handleScheduleCheckboxChange(index, "W")}
                      />
                      W
                    </label>
                    <label>
                      <input
                        type="checkbox"
                        checked={course.days.TR}
                        onChange={() => handleScheduleCheckboxChange(index, "TR")}
                      />
                      TR
                    </label>
                    <label>
                      <input
                        type="checkbox"
                        checked={course.days.F}
                        onChange={() => handleScheduleCheckboxChange(index, "F")}
                      />
                      F
                    </label>
                  </div>
                  {scheduleCourses.length > 1 && (
                    <button type="button" onClick={() => setScheduleCourses(scheduleCourses.filter((_, i) => i !== index))}>
                      Remove Course
                    </button>
                  )}
                </div>
              ))}
              <button type="button" onClick={addCourse}>+ Add Another Course</button>
              <div className="modal-actions">
                <button type="button" onClick={handleCloseScheduleModal}>Cancel</button>
                <button type="submit">Save Schedule</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};