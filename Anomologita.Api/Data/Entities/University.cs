using System.ComponentModel.DataAnnotations;

namespace Anomologita.Api.Data.Entities;

public class University
{
    public Guid Id { get; set; }

    [Required]
    [MaxLength(255)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(50)]
    public string ShortName { get; set; } = string.Empty;

    public string? Location { get; set; }

    public string? Website { get; set; }
}