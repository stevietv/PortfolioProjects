﻿namespace QuizGameAPI.Models;

public class Quiz
{
    public int Id { get; set; }

    public string Name { get; set; } = "";

    public ICollection<Question> Questions { get; } = new List<Question>();
    public ICollection<Game> Games { get; } = new List<Game>();
}