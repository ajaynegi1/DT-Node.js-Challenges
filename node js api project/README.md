To test the APIs i am using Thunder Client 




1  GET /api/v3/app/events  Fetch an Event by ID

http://localhost:3000/api/v3/app/events?id=eventid


2 GET /api/v3/app/events/latest  Fetch Latest Events with Pagination

http://localhost:3000/api/v3/app/events/latest?limit=5&page=1

3 Test POST /api/v3/app/events  Create a New Event

http://localhost:3000/api/v3/app/events

in json body 

{
  "name": "birthday",
  "tagline": "An amazing birthday",
  "schedule": "2024-12-25T10:00:00Z",
  "description": "a pary",
  "moderator": "user1",
  "category": "party",
  "sub_category": "birthday",
  "rigor_rank": 5
}

 Response:
201 response with { "id"" }.
4 PUT /api/v3/app/events/:id Update an Event

http://localhost:3000/api/v3/app/events/eventid

in jason body 
{
  "name": "Updated Event Name",
  "description": "Updated description of the event."
}

5  DELETE /api/v3/app/events/:id Delete an Event

http://localhost:3000/api/v3/app/events/eventid


  message: "Event deleted successfully" or  error: "Event not found" 