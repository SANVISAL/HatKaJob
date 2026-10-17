# EC2 creation
resource "aws_instance" "app_instance" {
  ami                  = var.ec2_ami
  instance_type        = var.ec2_instance_type
  iam_instance_profile = var.iam_instance_profile_name
  key_name             = "neakhatka-instance"
  security_groups      = [aws_security_group.ssh.name]

  tags = {
    Name = var.ec2_tag_name
  }
}

# COMMENT THIS OUT AFTER FIRST APPLY
resource "aws_security_group" "ssh" {
  name        = "allow_ssh"
  description = "Allow SSH inbound traffic"
  vpc_id      = "vpc-076135e6554b8f821"

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 3000
    to_port     = 3000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"] # Allows TCP traffic on port 3000 from any IP address
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "allow_ssh"
  }
}